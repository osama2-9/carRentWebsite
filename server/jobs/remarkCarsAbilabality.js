import prisma from "../DB/prisma/prismaClient.js";
export async function remarkCarsAbilabality() {
  try {
    const now = new Date();

    const unavailableCars = await prisma.car.findMany({
      where: { available: false },
      select: { id: true },
    });

    if (!unavailableCars.length) return;

    const carIds = unavailableCars.map((c) => c.id);

    const rentals = await prisma.rental.findMany({
      where: {
        carId: { in: carIds },
        status: "CONFIRMED",
      },
      select: {
        id: true,
        carId: true,
        endDate: true,
        returnTime: true,
      },
    });

    const carsToMarkAvailable = rentals
      .filter(
        (r) =>
          (r.returnTime && r.returnTime <= now) ||
          (!r.returnTime && r.endDate <= now)
      )
      .map((r) => r.carId);

    if (carsToMarkAvailable.length > 0) {
      await prisma.$transaction([
        prisma.car.updateMany({
          where: { id: { in: carsToMarkAvailable } },
          data: { available: true },
        }),
        prisma.rental.updateMany({
          where: { carId: { in: carsToMarkAvailable }, status: "COMPLETED" },
          data: { status: "COMPLETED" },
        }),
      ]);

      
    }
  } catch (error) {
    console.error("remarkCarsStatus error:", error);
  }
}
