import prisma from "../DB/prisma/prismaClient.js";
import { formatMonthYear } from "../utils/dateFormatter.js";

export const getMonthlyRentalCount = async (req, res) => {
  try {
    const rentals = await prisma.rental.findMany({
      select: { startDate: true },
    });

    if (!rentals || rentals.length === 0) {
      return res.status(400).json({ error: "No rentals found" });
    }

    const monthlyCount = {};

    for (const rental of rentals) {
      const date = new Date(rental.startDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyCount[key] = (monthlyCount[key] || 0) + 1;
    }

    const data = [];

    for (const key in monthlyCount) {
      if (monthlyCount.hasOwnProperty(key)) {
        const count = monthlyCount[key];
        const [year, month] = key.split("-").map(Number);
        const label = formatMonthYear(new Date(year, month));
        data.push({ name: label, rentals: count });
      }
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getMonthlyRevenue = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      select: {
        amount: true,
        paidAt: true,
      },
    });

    const date = {};

    for (const dates of payments) {
      let dateformat = formatMonthYear(dates.paidAt);
      if (!(dateformat in date)) {
        date[dateformat] = 0;
      }
      date[dateformat] += dates.amount;
    }
    const formattedData = Object.entries(date).map(([key, value]) => ({
      month: key,
      revenue: value,
    }));

    return res.status(200).json({
      data: formattedData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getRentalStatus = async (req, res) => {
  try {
    const rents = await prisma.rental.findMany({
      select: {
        status: true,
      },
    });

    const statusObj = {};

    for (const rent of rents) {
      const status = rent.status;

      if (!(status in statusObj)) {
        statusObj[status] = 0;
      }

      statusObj[status] += 1;
    }

    const formattedData = Object.entries(statusObj).map(([key, value]) => ({
      status: key,
      count: value,
    }));

    return res.status(200).json({
      data: formattedData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
export const getCarCountByFuelType = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      select: {
        fuelType: true,
      },
    });

    const fuelTypeObj = {};

    for (const car of cars) {
      const fuelType = car.fuelType;

      if (!(fuelType in fuelTypeObj)) {
        fuelTypeObj[fuelType] = 0;
      }

      fuelTypeObj[fuelType] += 1;
    }

    const formattedData = Object.entries(fuelTypeObj).map(([key, value]) => ({
      status: key,
      count: value,
    }));

    return res.status(200).json({
      data: formattedData,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
export const getContractCompletionStats = async (req, res) => {
  try {
    const rentals = await prisma.rentalContract.findMany({
      select: {
        isSigned: true,
      },
    });

    const stats = { signed: 0, unsigned: 0 };

    for (const rental of rentals) {
      if (rental.isSigned) {
        stats.signed += 1;
      } else {
        stats.unsigned += 1;
      }
    }

    const data = Object.entries(stats).map(([status, count]) => ({
      status,
      count,
    }));

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getRentalsByCity = async (req, res) => {
  try {
    const rentals = await prisma.car.findMany({
    select:{
        location:{
            select:{
                city:true
            }
        }
    }
    });

    const cityStats = {};

    for (const rental of rentals) {
      const city = rental.location.city || "Unknown";

      if (!(city in cityStats)) {
        cityStats[city] = 0;
      }

      cityStats[city] += 1;
    }

    const data = Object.entries(cityStats).map(([city, count]) => ({
      city,
      count,
    }));

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
