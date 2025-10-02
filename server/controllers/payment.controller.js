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
};
export const createCheckoutSession = async (req, res) => {
  try {
    const { amount, rentalId, customerId } = req.body;

    const paymentObj = await prisma.payment.findFirst({
      where: {
        rentalId: parseInt(rentalId),
      },
      select: {
        paidAt: true,
        id: true,
        status: true,
      },
    });

    let payment;
    if (
      paymentObj &&
      (paymentObj.paidAt == null || paymentObj.status === "FAILED")
    ) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Rental",
              },
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
        return res.status(400).json({
          error: "Failed to create checkout session",
        });
      }

      payment = await prisma.payment.update({
        where: {
          id: paymentObj.id,
        },
        data: {
          method: "STRIPE",
          amount: amount,
          status: "PENDING",
          stripePaymentIntentId: session.id,
          paidAt: null,
        },
      });

      await prisma.rental.update({
        where: {
          id: parseInt(rentalId),
        },
        data: {
          payment: {
            connect: {
              id: payment.id,
            },
          },
        },
      });

      return res.status(200).json({
        url: session.url,
        sessionId: session.id,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Rental",
            },
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
      return res.status(400).json({
        error: "Failed to create checkout session",
      });
    }

    const rental = await prisma.rental.findUnique({
      where: {
        id: parseInt(rentalId),
      },
    });

    if (!rental) {
      return res.status(400).json({
        error: "Rental not found",
      });
    }

    payment = await prisma.payment.create({
      data: {
        method: "STRIPE",
        amount: amount,
        rentalId: parseInt(rentalId),
        status: "PENDING",
        stripePaymentIntentId: session.id,
      },
    });

    await prisma.rental.update({
      where: {
        id: parseInt(rentalId),
      },
      data: {
        payment: {
          connect: {
            id: payment.id,
          },
        },
      },
    });

    res.status(200).json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const verifyPaymentSession = async (req, res) => {
  try {
    const { sessionId, rentalId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
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
