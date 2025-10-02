import express from "express";
import { createCheckoutSession, createPaymentIntent, verifyPaymentSession } from "../controllers/payment.controller.js";
import { verifyUser } from "../auth/verifyCookie.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-intent", createPaymentIntent);
paymentRouter.post("/create-checkout-session",verifyUser, createCheckoutSession);
paymentRouter.post("/verify-payment-session",verifyUser, verifyPaymentSession);

export default paymentRouter;
