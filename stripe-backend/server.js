const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { couponCode } = req.body;
  console.log("Received coupon code:", couponCode); 

  try {
    // Session parameters without discount
    const sessionParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_1OtRYHSFe3q2NPFvu6Tvmd7G, // Your price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    };

    if (couponCode && couponCode.trim()) {
      console.log("Checking coupon:", couponCode.trim());
      try {
        const coupon = await stripe.coupons.retrieve(couponCode.trim());
        console.log("Coupon details:", coupon);

        if (coupon && coupon.valid) {
          sessionParams.discounts = [{ coupon: coupon.id }];
        } else {
          return res.status(400).json({ error: "Invalid coupon code" });
        }
      } catch (error) {
        return res.status(400).json({ error: "Invalid coupon code" });
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log("session: ", session);
    res.json({ id: session.id });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Invalid or expired coupon code." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
