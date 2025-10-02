import { subMinutes } from "date-fns";
import prisma from "../DB/prisma/prismaClient.js";

export const autoCancelRentals = async () => {
  try {
    const now = new Date();
    const unsignedRentals = await prisma.rental.findMany({
      where: {
        status: "PENDING",
        signedAt: null,
        createdAt: { lt: subMinutes(now, 15) },
      },
    });
    for (const rental of unsignedRentals) {
      await prisma.rental.update({
        where: { id: rental.id },
        data: {
          status: "CANCELLED",
          cancelledAt: now,
          cancellationReason: "Sysetm message: not_signed",
          car: {
            update: {
              available: true,
            },
          },
        },
      });
    }
    const unpaidRentals = await prisma.rental.findMany({
      where: {
        status: "PENDING",
        signedAt: { not: null },
        paidAt: null,
        signedAt: { lt: subMinutes(now, 15) },
      },
    });

    for (const rental of unpaidRentals) {
      await prisma.rental.update({
        where: { id: rental.id },
        data: {
          status: "CANCELLED",
          cancelledAt: now,
          cancellationReason: "Sysetm message: not_paid",
          car: {
            update: {
              available: true,
            },
          },
        },
      });
    }
    console.log("auto-canellation called");
  } catch (error) {
    throw new Error(error.message);
  }
};
