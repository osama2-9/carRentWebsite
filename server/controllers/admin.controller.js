import prisma from "../DB/prisma/prismaClient.js";

export const dashboardMetrics = async (req, res) => {
  try {
    const revenue = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
    });

    const totalUsers = await prisma.user.count({
      where: {
        role: {
          not: "ADMIN",
        },
      },
    });

    const totalCars = await prisma.car.count({
      where: {
        available: {
          equals: true,
        },
      },
    });

    const totalRentals = await prisma.rental.count({
      where: {
        status: {
          equals: "CONFIRMED",
        },
      },
    });

    const stats = {
      revenue: revenue._sum.amount || 0,
      totalUsers,
      totalCars,
      totalRentals,
    };

    return res.status(200).json(stats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const dashboardRevenueOverview = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    const monthlyRaw = await prisma.payment.findMany({
      where: {
        paidAt: {
          not: null,
          gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
      select: {
        amount: true,
        paidAt: true,
      },
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyRevenueMap = {};
    monthlyRaw.forEach((payment) => {
      if (!payment.paidAt) return;
      const date = new Date(payment.paidAt);
      const monthIndex = date.getMonth();
      const key = `${months[monthIndex]} ${currentYear}`;
      monthlyRevenueMap[key] = (monthlyRevenueMap[key] || 0) + payment.amount;
    });

    const chartData = months.map((month, idx) => {
      const key = `${month} ${currentYear}`;
      return {
        month: key,
        amount: monthlyRevenueMap[key] || 0,
      };
    });

    return res.status(200).json({
      chartData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const dashboardFleetDistribution = async (req, res) => {
  try {
    const cars = await prisma.car.findMany({
      select: {
        id: true,
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    const fleetDistribution = {};

    cars.forEach((car) => {
      const categoryName = car.category.name;
      if (!fleetDistribution[categoryName]) {
        fleetDistribution[categoryName] = 0;
      }
      fleetDistribution[categoryName] += 1;
    });

    const totalCars = cars.length;

    const fleetDistributionPercent = Object.entries(fleetDistribution).map(
      ([category, count]) => ({
        category,
        percent:
          totalCars > 0 ? ((count / totalCars) * 100).toFixed(2) : "0.00",
      })
    );

    const tailwindColors = [
      "#3b82f6",
      "#8b5cf6",
      "#ef4444",
      "#0ea5e9",
      "#10b981",
      "#f59e0b",
      "#ec4899",
    ];

    const fleetDistributionMap = fleetDistributionPercent.map(
      (item, index) => ({
        name: item.category,
        value: parseFloat(item.percent),
        color: tailwindColors[index % tailwindColors.length],
      })
    );

    return res.status(200).json({
      fleetDistributionMap,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const dashboardTopPerformingVehicles = async (req, res) => {
  try {
    const rents = await prisma.rental.findMany({
      select: {
        carId: true,
        car: {
          select: {
            featuredImage: true,
            make: true,
            model: true,
            Review: {
              select: { rating: true },
            },
          },
        },
        payment: {
          select: {
            amount: true,
            rentalId: true,
          },
        },
      },
    });

    const carStats = {};
    rents.forEach((rent) => {
      if (!carStats[rent.carId]) {
        carStats[rent.carId] = {
          carId: rent.carId,
          make: rent.car.make,
          model: rent.car.model,
          featuredImage: rent.car.featuredImage,
          rentals: 0,
          totalRevenue: 0,
          avgRating:
            rent.car.Review.length > 0
              ? (
                  rent.car.Review.reduce((sum, r) => sum + r.rating, 0) /
                  rent.car.Review.length
                ).toFixed(2)
              : null,
        };
      }
      carStats[rent.carId].rentals += 1;
      if (rent.payment && rent.payment.amount) {
        carStats[rent.carId].totalRevenue += rent.payment.amount;
      }
    });

    const sorted = Object.values(carStats)
      .sort((a, b) => {
        if (b.rentals === a.rentals) {
          return b.totalRevenue - a.totalRevenue;
        }
        return b.rentals - a.rentals;
      })
      .slice(0, 4);

    return res.status(200).json({
      data: sorted,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getRecentBookings = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const pageInt = parseInt(page);
    const limit = 5;
    const bookings = await prisma.rental.findMany({
      select: {
        id: true,
        startDate: true,
        endDate: true,
        status: true,
        payment: {
          select: {
            amount: true,
            status: true,
          },
        },
        car: {
          select: {
            make: true,
            model: true,
            location: {
              select: {
                address: true,
                city: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
      skip: (pageInt - 1) * limit,
      take: limit,
    });
    const totalBookings = await prisma.rental.count();
    const totalPages = Math.ceil(totalBookings / limit);

    res.status(200).json({
      bookings,
      totalPages,
      currentPage: pageInt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const users = await prisma.user.findMany({
      where: {
        role: { not: "ADMIN" },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        emailVerified: true,
        passportUrl: true,
        licenseExpiryDate: true,
        nationality: true,
        documentsVerified: true,
        driverLicenseUrl: true,
        proofOfAddressUrl: true,
        role: true,
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        error: "User Id is required",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (!user) {
      return res.status(400).json({
        error: "no user found",
      });
    }
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId, name, email, phone, role, nationality, gender } = req.body;
    if (!userId) {
      return res.status(400).json({
        error: "User id is required",
      });
    }
    const update = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        phone,
        role,
        nationality,
        gender,
      },
    });

    if (!update) {
      return res.status(400).json({
        error: "Error while try to update user",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getReviews = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const pageInt = parseInt(page);
    const limit = 8;

    const bookings = await prisma.rental.findMany({
      select: {
        car: {
          select: {
            make: true,
            model: true,
            year: true,
            licensePlate: true,
            featuredImage: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            passportUrl: true,
            driverLicenseUrl: true,
          },
        },
        startDate: true,
        endDate: true,
        pickupTime: true,
        returnTime: true,
        status: true,
        rentalContract: {
          select: {
            contractUrl: true,
            isSigned: true,
          },
        },
        payment: {
          select: {
            method: true,
            status: true,
            amount: true,
            paidAt: true,
          },
        },
      },
      skip: (pageInt - 1) * limit,
      take: limit,
    });
    const totalBookings = await prisma.rental.count();
    const totalPages = Math.ceil(totalBookings / limit);

    res.status(200).json({
      bookings,
      totalPages,
      currentPage: pageInt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getBookingsDetails = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const pageInt = parseInt(page);
    const limit = 5;
    const bookings = await prisma.rental.findMany({
      select: {
        id: true,
        cancellationReason: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            passportUrl: true,
            driverLicenseUrl: true,
            documentsVerified: true,
          },
        },
        car: {
          select: {
            make: true,
            model: true,
            year: true,
            licensePlate: true,
            featuredImage: true,
            category: {
              select: {
                name: true,
                dailyRate: true,
              },
            },
            location: {
              select: {
                address: true,
                city: true,
                country: true,
              },
            },
          },
        },
        startDate: true,
        endDate: true,
        pickupTime: true,
        returnTime: true,
        status: true,
        rentalContract: {
          select: {
            contractUrl: true,
            isSigned: true,
            signedAt: true,
            verified: true,
          },
        },
        payment: {
          select: {
            method: true,
            status: true,
            amount: true,
            paidAt: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (pageInt - 1) * limit,
      take: limit,
    });
    const totalBookings = await prisma.rental.count();
    const totalPages = Math.ceil(totalBookings / limit);

    return res.status(200).json({
      bookings,
      totalPages,
      currentPage: pageInt,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.query;
    if (!bookingId) {
      return res.status(400).json({
        error: "Booking id is required",
      });
    }
    const booking = await prisma.rental.delete({
      where: {
        id: parseInt(bookingId),
      },
    });
    if (!booking) {
      return res.status(400).json({
        error: "Can't delete booking",
      });
    }
    return res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { carId } = req.query;
    if (!carId) {
      return res.status(400).json({
        error: "Car id is required",
      });
    }
    const car = await prisma.car.update({
      where: {
        id: parseInt(carId),
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    if (!car) {
      return res.status(400).json({
        error: "Can't delete car",
      });
    }
    return res.status(200).json({
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getCarsToTrack = async (req, res) => {
  try {
    const cars = await prisma.carLocation.findMany({
      select: {
        id: true,
        lat: true,
        lng: true,
        timestamp: true,
        rental: {
          select: {
            startDate: true,
            endDate: true,
            status: true,

            user: {
              select: {
                name: true,
                phone: true,
                email: true,
              },
            },
            car: {
              select: {
                make: true,
                model: true,
                licensePlate: true,
                fuelType: true,
                year: true,
              },
            },
          },
        },
      },
    });
    if (!cars) {
      return res.status(400).json({
        data: [],
      });
    }
    return res.status(200).json({
      data: cars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const softDeleteUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    const deleteUser = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    if (!deleteUser) {
      return res.status(400).json({
        error: "Can't delete user,please try again later",
      });
    }
    return res.status(200).json({
      message: "User deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const listStaffUsers = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;
    const staff = await prisma.user.findMany({
      where: {
        role: "STAFF",
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        gender: true,
        nationality: true,
        dateOfBirth: true,
        isDeleted: true,
      },
      take: limitInt,
      skip: skip,
    });
    const totalStaff = await prisma.user.count({
      where: {
        role: "STAFF",
      },
    });
    if (!staff) {
      return res.status(400).json({
        error: "Can't get staff user,please try again later",
      });
    }
    return res.status(200).json({
      data: staff,
      page: pageInt,
      limit: limitInt,
      totalPages: Math.ceil(totalStaff / limitInt),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getUsersReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    const aggregatedReviews = await prisma.review.groupBy({
      by: ["carId"],
      _avg: { rating: true },
      _count: { rating: true },
      orderBy: { _count: { rating: "desc" } },
      skip,
      take: limitInt,
    });

    const carIds = aggregatedReviews.map((r) => r.carId).filter(Boolean);
    const cars = await prisma.car.findMany({
      where: { id: { in: carIds } },
      select: {
        id: true,
        make: true,
        model: true,
        year: true,
        licensePlate: true,
        featuredImage: true,
      },
    });

    const result = aggregatedReviews.map((group) => {
      const car = cars.find((c) => c.id === group.carId);
      return {
        ...car,
        avgRate: Number(group._avg.rating?.toFixed(2)),
        totalReviews: group._count.rating,
      };
    });

    const totalCarsWithReviews = await prisma.review.groupBy({
      by: ["carId"],
      _count: true,
    });

    return res.status(200).json({
      data: result,
      page: pageInt,
      limit: limitInt,
      totalPages: Math.ceil(totalCarsWithReviews.length / limitInt),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
