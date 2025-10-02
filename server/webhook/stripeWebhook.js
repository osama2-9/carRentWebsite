import express from "express";
import bodyParser from "body-parser";
import { stripe } from "../services/stripe.js";
import dotenv from "dotenv";
import prisma from "../DB/prisma/prismaClient.js";

dotenv.config();

const webhook = express.Router();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

webhook.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature invalid:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const rentalId = parseInt(paymentIntent.metadata.rentalId);

        await prisma.payment.update({
          where: { rentalId },
          data: {
            status: "SUCCESS",
            paidAt: new Date(),
            stripePaymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount_received / 100,
          },
        });

        await prisma.rental.update({
          where: { id: rentalId },
          data: { status: "CONFIRMED" },
        });

        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
);

export default webhook;
