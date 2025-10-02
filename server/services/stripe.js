import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

async function testConnection() {
  try {
    const customers = await stripe.customers.list({ limit: 1 });
    console.log("✅ Connected to Stripe. Fetched customers:");
   
  } catch (err) {
    console.error("❌ Failed to connect to Stripe:", err.message);
  }
}

export {stripe}

testConnection();
