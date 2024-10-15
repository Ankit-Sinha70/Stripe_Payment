import React, { useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import "./CheckoutForm.css"; // Import your CSS

const CheckoutForm = () => {
  const stripe = useStripe();
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle payment submission
  const handlePayment = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ couponCode }), // Send coupon code even if it's empty
        }
      );

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      const { error }: any = await stripe?.redirectToCheckout({
        sessionId: data.id,
      });

      if (error) {
        setError("Stripe checkout error: " + error.message);
      }
    } catch (error) {
      setError("Something went wrong, please try again later.");
    }

    setLoading(false);
  };

  // Handle skip functionality
  const handleSkip = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://localhost:5000/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ couponCode: "" }),
        }
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      const { error }: any = await stripe?.redirectToCheckout({
        sessionId: data.id,
      });

      if (error) {
        setError("Stripe checkout error: " + error.message);
      }
    } catch (error) {
      setError("Something went wrong, please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="checkout-form">
      <h2>Apply Coupon Code</h2>
      <form onSubmit={handlePayment}>
        <input
          type="text"
          placeholder="Enter coupon code (optional)"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          disabled={loading}
        />
        {error && <p>{error}</p>}

        {/* Pay and Skip buttons */}
        <button type="submit" disabled={!stripe || loading}>
          Pay
        </button>
        <button type="button" onClick={handleSkip} disabled={loading}>
          Skip
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;