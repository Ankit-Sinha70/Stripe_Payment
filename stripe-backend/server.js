const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
require("dotenv").config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { couponCode } = req.body;

  try {
    const sessionParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1OtRYHSFe3q2NPFvu6Tvmd7G",
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    };

    if (couponCode && couponCode.trim()) {
      try {
        const coupon = await stripe.coupons.retrieve(couponCode.trim());
        if (coupon && coupon.valid && coupon.active) {
          sessionParams.discounts = [{ coupon: coupon.id }];
        } else {
          return res.status(400).json({ error: "Invalid coupon code" });
        }
      } catch (error) {
        return res.status(400).json({ error: "Invalid coupon code" });
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log("Session: ", session);
    res.json({ id: session.id });
  } catch (error) {
    return res
      .status(400)
      .json({ error: error.message || "An error occurred." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
