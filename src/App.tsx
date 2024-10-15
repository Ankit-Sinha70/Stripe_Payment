import "./App.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

function App() {
  const pk = import.meta.env.VITE_PUBLISHABLE_KEY;
  const stripePromise = loadStripe(pk);
  // const options: any = {
  //   mode: "payment",
  //   amount: 1099,
  //   currency: "usd",
  // };

  return (
    <>
      <div>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </>
  );
}

export default App;
