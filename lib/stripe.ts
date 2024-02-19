import Stripe from "stripe";

if (!process.env.STRIPE_API_KEY) throw new Error("No STRIPE_API_KEY provided");

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});

