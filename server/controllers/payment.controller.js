import { stripe } from "../services/stripe.js";
import prisma from "../../server/DB/prisma/prismaClient.js";
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, rentalId, customerId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      metadata: {
        rentalId: rentalId,
        customerId: customerId,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};export const createCheckoutSession = async (req, res) => {
  try {
    const { amount, rentalId, customerId } = req.body;

    // 1. Check rental exists
    const rental = await prisma.rental.findUnique({
      where: { id: parseInt(rentalId) },
    });

    if (!rental) {
      return res.status(404).json({ error: "Rental not found" });
    }

    // 2. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Rental" },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        rentalId: rentalId,
        customerId: customerId,
      },
      success_url:
        "http://localhost:3000/pages/customer/dashboard?session_id={CHECKOUT_SESSION_ID}",
      cancel_url:
        "http://localhost:3000/pages/customer/dashboard?session_id={CHECKOUT_SESSION_ID}",
    });

    if (!session) {
      return res
        .status(400)
        .json({ error: "Failed to create checkout session" });
    }

    // 3. Create/Update Payment + Link Rental in a transaction
    const payment = await prisma.$transaction(async (tx) => {
      let paymentRecord = await tx.payment.findFirst({
        where: { rentalId: parseInt(rentalId) },
      });

      if (paymentRecord) {
        // Update existing payment
        paymentRecord = await tx.payment.update({
          where: { id: paymentRecord.id },
          data: {
            method: "STRIPE",
            amount,
            status: "PENDING",
            stripePaymentIntentId: session.id,
            paidAt: null,
          },
        });
      } else {
        // Create new payment
        paymentRecord = await tx.payment.create({
          data: {
            method: "STRIPE",
            amount,
            rentalId: parseInt(rentalId),
            status: "PENDING",
            stripePaymentIntentId: session.id,
          },
        });
      }

      // Link rental → payment
      await tx.rental.update({
        where: { id: parseInt(rentalId) },
        data: { payment: { connect: { id: paymentRecord.id } } },
      });

      return paymentRecord;
    });

    return res.status(200).json({
      url: session.url,
      sessionId: session.id,
      paymentId: payment.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const verifyPaymentSession = async (req, res) => {
  try {
    const { sessionId, rentalId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status  === "paid") {
      await prisma.payment.update({
        where: {
          stripePaymentIntentId: session.id,
          rentalId: parseInt(rentalId),
        },
        data: {
          status: "SUCCESS",
          paidAt: new Date(),
        },
      });

      await prisma.rental.update({
        where: {
          id: parseInt(rentalId),
        },
        data: {
          status: "CONFIRMED",
        },
      });
      await prisma.rental.update({
        where: {
          id: parseInt(rentalId),
        },
        data: {
          car: {
            update: {
              available: false,
            },
          },
        },
      });
    } else if (session.payment_status === "unpaid") {
      await prisma.payment.update({
        where: {
          stripePaymentIntentId: session.id,
        },
        data: {
          status: "FAILED",
          paidAt: new Date(),
        },
      });

      await prisma.rental.update({
        where: {
          id: session.metadata.rentalId,
        },
        data: {
          status: "FAILED",
        },
      });

      return res.status(200).json({
        success: true,
      });
    }

    if (!session) {
      return res.status(400).json({
        error: "Failed to retrieve checkout session",
      });
    }

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
