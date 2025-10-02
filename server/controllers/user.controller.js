import prisma from "../DB/prisma/prismaClient.js";
import { v4 as uuidv4 } from "uuid";
import supbase from "../utils/supbase.js";
import { generateContractPDF } from "../contracts/generateContract.js";
import { sendContractSignEmail } from "../emails/sendContractSignEmail.js";
import { validateDocumentsFromFiles } from "../docAnalyzer/documentsValidator.js";
import { escapeRegExp } from "pdf-lib";

export const searchCars = async (req, res) => {
  try {
    const { location, pickupDate, returnDate, pickupTime, returnTime } =
      req.query;

    if (!location || !pickupDate || !returnDate || !pickupTime || !returnTime) {
      return res.status(400).json({ error: "Please fill all inputs" });
    }

    const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const endDateTime = new Date(`${returnDate}T${returnTime}`);

    if (isNaN(startDateTime) || isNaN(endDateTime)) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }

    if (startDateTime >= endDateTime) {
      return res
        .status(400)
        .json({ error: "End date must be after start date" });
    }

    const allCars = await prisma.car.findMany({
      where: {
        available: true,
        isDeleted: false,
        location: {
          address: location,
        },
      },
      include: {
        rentals: {
          where: {
            startDate: { lt: endDateTime },
            endDate: { gt: startDateTime },
          },
        },
        category: true,
        location: true,
        Review: {
          select: { rating: true },
        },
      },
    });

    const formattedCars = allCars.map((car) => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      transmission: car.transmission,
      fuelType: car.fuelType,
      seats: car.seats,
      licensePlate: car.licensePlate,
      available: car.available,
      featuredImage: car.featuredImage,
      imagesUrl: car.imagesUrl,
      createdAt: car.createdAt,

      location: {
        id: car.location.id,
        city: car.location.city,
        address: car.location.address,
        googleMapsUrl: car.location.googleMapsUrl,
      },

      category: {
        id: car.category.id,
        name: car.category.name,
        dailyRate: car.category.dailyRate,
      },

      averageRating:
        car.Review.length > 0
          ? (
              car.Review.reduce((sum, r) => sum + r.rating, 0) /
              car.Review.length
            ).toFixed(1)
          : null,
    }));

    if (formattedCars.length === 0) {
      return res.status(404).json({ error: "No cars found" });
    }

    return res.status(200).json({ data: formattedCars });
  } catch (error) {
    console.error("Error in searchCars:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyDocuments = async (req, res) => {
  try {
    const { passportImage, licenseImage, userId } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        passportUrl: true,
        driverLicenseUrl: true,
      },
    });

    if (user.driverLicenseUrl != null && user.passportUrl != null) {
      return res.status(200).json({
        message: "You already have upload a documents",
      });
    }

    if (!passportImage && !licenseImage) {
      return res.status(400).json({
        success: false,
        message: "At least one document (passport or license) is required.",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const report = await validateDocumentsFromFiles(
      passportImage,
      licenseImage
    );

    const updateData = {
      ValidationReport: report,
    };

    if (passportImage) {
      updateData.passportUrl = passportImage;
    }
    if (licenseImage) {
      updateData.driverLicenseUrl = licenseImage;
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Documents processed successfully.",
    });
  } catch (error) {
    console.error("Document verification error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to process documents",
      message: error.message,
    });
  }
};

export const rentCarRequest = async (req, res) => {
  try {
    const {
      userId,
      carId,
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
      total,
    } = req.body;

    if (
      !userId ||
      !carId ||
      !pickupDate ||
      !returnDate ||
      !pickupTime ||
      !returnTime ||
      !total
    ) {
      return res.status(400).json({
        error: "Please fill all inputs",
      });
    }

    const car = await prisma.car.findUnique({
      where: {
        id: carId,
      },
      select: {
        available: true,
        category: true,
        make: true,
        model: true,
        licensePlate: true,
      },
    });

    if (!car || !car.available) {
      return res.status(400).json({
        error: "Sorry, car is unavailable now try again later",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        passportUrl: true,
        driverLicenseUrl: true,
        documentsVerified: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (!user.passportUrl || !user.driverLicenseUrl) {
      return res.status(400).json({
        error:
          "Please upload the required documents from your dashboard to reserve a car",
      });
    }

    if (!user.documentsVerified) {
      return res.status(400).json({
        error:
          "Document's under verification please try, we will inform you when finish soon",
      });
    }

    const startDateTime = new Date(`${pickupDate}T${pickupTime}:00.000Z`);
    const endDateTime = new Date(`${returnDate}T${returnTime}:00.000Z`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return res.status(400).json({
        error: "Invalid date or time format",
      });
    }

    if (startDateTime >= endDateTime) {
      return res.status(400).json({
        error: "End date must be after start date",
      });
    }

    const newRental = await prisma.rental.create({
      data: {
        carId: carId,
        userId: userId,
        status: "PENDING",
        startDate: startDateTime,
        endDate: endDateTime,
        pickupTime: pickupTime,
        returnTime: returnTime,
        totalCost: total,
        signedAt: null,
        paidAt: null,
      },
    });

    if (newRental) {
      const pdfBuffer = await generateContractPDF({
        userName: user.name,
        userEmail: user.email,
        carMake: car.make,
        carModel: car.model,
        licensePlate: car.licensePlate,
        startDate: startDateTime,
        endDate: endDateTime,
        dailyRate: car.category.dailyRate,
        totalCost: total,
      });

      let id = uuidv4();
      const filePath = `contracts/contract_rental_${id}.pdf`;
      const { data, error: uploadError } = await supbase.storage
        .from("easydrive")
        .upload(filePath, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return res.status(500).json({ error: "Failed to upload contract" });
      }

      const {
        data: { publicUrl },
        error: urlError,
      } = supbase.storage.from("easydrive").getPublicUrl(filePath);

      if (urlError) {
        console.error("Supabase URL error:", urlError);
        return res.status(500).json({ error: "Failed to get contract URL" });
      }

      const rentalContract = await prisma.rentalContract.create({
        data: {
          contractUrl: publicUrl,
          uploadedAt: new Date(),
          rentalId: newRental?.id,
        },
      });

      return res.status(201).json({
        message: "Rental created and contract uploaded.",
        rentalId: newRental.id,
        contractUrl: rentalContract.contractUrl,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const viewMyRentals = async (req, res) => {
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
      select: {
        role: true,
      },
    });

    if (user.role != "CUSTOMER") {
      return res.status(400).json({
        error: "Unable to find user rentels",
      });
    }

    const rentels = await prisma.rental.findMany({
      where: {
        userId: parseInt(userId),
      },
      select: {
        car: {
          select: {
            category: true,
            featuredImage: true,
            fuelType: true,
            id: true,
            location: {
              select: {
                address: true,
                country: true,
                id: true,
                googleMapsUrl: true,
              },
            },
            model: true,
            make: true,
            year: true,
            seats: true,
            rentals: {
              select: {
                rentalContract: {
                  select: {
                    id: true,
                    contractUrl: true,
                    signedContract: true,
                    verified: true,
                    verifiedAt: true,
                    contractConditionsAccept: true,
                  },
                },
                id: true,
                payment: true,
                startDate: true,
                endDate: true,
                status: true,
                totalCost: true,
                pickupTime: true,
                returnTime: true,
              },
            },
          },
        },
      },
    });

    if (!rentels) {
      return res.status(400).json({
        error: "No rentals found",
      });
    }
    return res.status(200).json({
      rentels,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getNextRental = async (req, res) => {
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
      return res.status(404).json({
        error: "User not found",
      });
    }

    const lastRental = await prisma.rental.findFirst({
      where: {
        userId: parseInt(userId),
      },
      select: {
        id: true,
        rentalContract: {
          select: {
            contractUrl: true,
            rentalId: true,
            isSigned: true,
          },
        },
        car: {
          select: {
            make: true,
            model: true,
            year: true,
            featuredImage: true,
            location: {
              select: {
                address: true,
                city: true,
                country: true,
                googleMapsUrl: true,
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            status: true,
            paidAt: true,
            method: true,
            amount: true,
          },
        },
        startDate: true,
        endDate: true,
        pickupTime: true,
        returnTime: true,
        totalCost: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastRental) {
      return res.status(404).json({
        isThereLastRental: false,
        message: "No rentals found for this user",
      });
    }

    return res.status(200).json({
      isThereLastRental: true,
      lastRental,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const requestSignOnContract = async (req, res) => {
  try {
    const { userId, rentalId } = req.body;
    if (!userId || !rentalId) {
      return res.status(400).json({
        error: "User Id and rental Id are required",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await prisma.user.findUnique({
        where: {
          id: parseInt(userId),
        },
      });
      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      const rental = await prisma.rental.findUnique({
        where: {
          id: parseInt(rentalId),
        },
        select: {
          id: true,
          signedAt: true,
          paidAt: true,
          status: true,
          cancellationReason: true,
          rentalContract: {
            select: {
              id: true,
              contractUrl: true,
              signingToken: true,
              signingTokenExpiry: true,
            },
          },
        },
      });
      if (!rental) {
        throw new Error("RENTAL_NOT_FOUND");
      }
      if (rental.status === "CANCELLED") {
        if (!rental.signedAt) throw new Error("CANCELLED_NOT_SIGNED");
        if (rental.signedAt && !rental.paidAt)
          throw new Error("CANCELLED_NOT_PAID");
      }
      const now = new Date();
      const expiry = new Date(now.getTime() + 60 * 60 * 1000);
      let signingToken = rental.rentalContract?.signingToken;
      if (
        !signingToken ||
        (rental.rentalContract.signingTokenExpiry &&
          rental.rentalContract.signingTokenExpiry < now)
      ) {
        signingToken = uuidv4();
      }

      const rentalContract = await tx.rentalContract.upsert({
        where: { rentalId: parseInt(rentalId) },
        update: {
          signingToken,
          signingTokenExpiry: expiry,
          signerEmail: user.email,
          signerName: user.name,
        },
        create: {
          rentalId: parseInt(rentalId),
          contractUrl: rental.rentalContract.contractUrl,
          signingToken,
          signingTokenExpiry: expiry,
          signerEmail: user.email,
          signerName: user.name,
        },
      });
      return { user, rental, rentalContract, signingToken };
    });

    const signLink = `http://localhost:3000/pages/customer/sign-contract?token=${result.signingToken}&rentalId=${result.rental.id}&uid=${result.user.id}&contractId=${result.rentalContract.id}`;
    await sendContractSignEmail(
      result.user.email,
      result.user.name,
      result.rentalContract.contractUrl,
      signLink
    );

    return res.status(200).json({
      message:
        "We have sent you an email to sign the contract , please check your email",
    });
  } catch (error) {
    console.log(error);

    if (error.message === "USER_NOT_FOUND")
      return res.status(404).json({ error: "User not found" });
    if (error.message === "RENTAL_NOT_FOUND")
      return res.status(404).json({ error: "Rental not found" });
    if (error.message === "CANCELLED_NOT_SIGNED")
      return res
        .status(400)
        .json({ error: "Rental was cancelled because it was never signed." });
    if (error.message === "CANCELLED_NOT_PAID")
      return res
        .status(400)
        .json({ error: "Rental was cancelled because it was not paid." });

    return res.status(500).json({ error: "Internal server error" });
  }
};

export const signByEmail = async (req, res) => {
  try {
    const { userId, rentalId, token, contractId } = req.body;
    const userIdInt = parseInt(userId);
    const rentalIdInt = parseInt(rentalId);
    const contractIdInt = parseInt(contractId);
    if (!userIdInt || !rentalIdInt || !token || !contractIdInt) {
      return res.status(400).json({
        error: "User Id and contract Id are required",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userIdInt,
      },
    });
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    const rentalContract = await prisma.rentalContract.findFirst({
      where: {
        id: contractIdInt,
      },
      select: {
        signingToken: true,
        signingTokenExpiry: true,
        id: true,
        rentalId: true,
      },
    });
    if (!rentalContract) {
      return res.status(400).json({
        error: "Rental contract not found",
      });
    }
    if (rentalContract.signingToken != token) {
      return res.status(400).json({
        error: "Invalid signing token",
      });
    }
    if (rentalContract.signingTokenExpiry < new Date()) {
      return res.status(400).json({
        error: "Signing token expired",
      });
    }
    const updateRentalContract = await prisma.rentalContract.update({
      where: {
        id: contractIdInt,
      },
      data: {
        agreementAccepted: true,
        contractConditionsAccept: true,
        signedAt: new Date(),
        isSigned: true,
        signingTokenExpiry: null,
        signerEmail: user.email,
        signerName: user.name,
        signingToken: null,
      },
    });
    if (!updateRentalContract) {
      return res.status(400).json({
        error: "Rental contract not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Rental contract signed, check your email for payment details",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const startTracking = async (req, res) => {
  try {
    const { rentalId, lat, lng } = req.body;
    const findSameRental = await prisma.carLocation.findFirst({
      where: {
        rentalId: parseInt(rentalId),
      },
    });
    if (!rentalId) {
      return res.status(400).json({
        error: "rentalId is required",
      });
    }
    if (!lat || !lng) {
      return res.status(400).json({
        error: "lat and lng are required",
      });
    }

    if (findSameRental) {
      return res.status(400).json({
        success: true,
      });
    }
    const rental = await prisma.rental.findUnique({
      where: {
        id: parseInt(rentalId),
      },
      select: {
        CarLocation: true,
      },
    });
    if (!rental) {
      return res.status(404).json({
        error: "Rental not found",
      });
    }
    const carLocation = await prisma.carLocation.create({
      data: {
        rentalId: parseInt(rentalId),
        lat: lat,
        lng: lng,
      },
    });
    if (!carLocation) {
      return res.status(500).json({
        error: "Failed to create car location",
      });
    }
    return res.status(200).json({
      success: true,
      locationId: carLocation.id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { locationId, lat, lng } = req.body;
    const carLocation = await prisma.carLocation.findUnique({
      where: {
        id: parseInt(locationId),
      },
    });
    if (!carLocation) {
      return res.status(404).json({
        error: "Car location not found",
      });
    }
    const updatedCarLocation = await prisma.carLocation.update({
      where: {
        id: parseInt(locationId),
      },
      data: {
        lat: lat,
        lng: lng,
        timestamp: new Date(),
      },
    });
    if (!updatedCarLocation) {
      return res.status(500).json({
        error: "Failed to update car location",
      });
    }
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getDocuments = async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) {
      return res.status(400).json({
        error: "Customer Id is required",
      });
    }

    const customer = await prisma.user.findUnique({
      where: {
        id: parseInt(customerId),
      },
      select: {
        passportUrl: true,
        driverLicenseUrl: true,
      },
    });
    if (!customer) {
      return res.status(400).json({
        error: "Customer not found",
      });
    }
    return res.status(200).json({
      data: customer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getMyRentals = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const userId = req.user?.id;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    const userIdInt = parseInt(userId);
    if (!userId) {
      return res.status(400).json({
        error: "User Id is required",
      });
    }
    const myRentals = await prisma.rental.findMany({
      where: {
        userId: userIdInt,
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        pickupTime: true,
        returnTime: true,
        status: true,
        totalCost: true,
        car: {
          select: {
            make: true,
            model: true,
            year: true,
            licensePlate: true,
            featuredImage: true,
            fuelType: true,
            transmission: true,
            seats: true,
            category: {
              select: {
                name: true,
              },
            },
            location: {
              select: {
                city: true,
                address: true,
                country: true,
                googleMapsUrl: true,
              },
            },
          },
        },

        payment: {
          select: {
            amount: true,
            method: true,
            status: true,
            paidAt: true,
          },
        },
        rentalContract: {
          select: {
            contractUrl: true,
            isSigned: true,
            signedAt: true,
            agreementAccepted: true,
          },
        },
      },
      skip: skip,
      take: limitInt,
      orderBy: {
        startDate: "desc",
      },
    });
    const totalRents = await prisma.rental.count({
      where: {
        userId: userIdInt,
      },
    });

    return res.status(200).json({
      data: myRentals,
      page: pageInt,
      limit: limitInt,
      totalPages: Math.ceil(totalRents / limit),
      totalRents: totalRents,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

export const submitReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { rentalId, comment, rating } = req.body;
    if (!userId) {
      return res.status(400).json({
        errro: "User Id is required",
      });
    }
    if (!rentalId) {
      return res.status(400).json({
        errro: "Rental Id is required",
      });
    }
    const rental = await prisma.rental.findUnique({
      where: {
        id: rentalId,
      },
      select: {
        carId: true,
      },
    });
    if (!rental) {
      return res.status(400).json({
        errro: "Rental not found",
      });
    }
    const newReview = await prisma.review.create({
      data: {
        carId: rental?.carId,
        userId: userId,
        comment: comment,
        rating: rating,
        createdAt: new Date(),
      },
    });
    if (!newReview) {
      return res.status(400).json({
        error: "Error while submit your review,please try again later",
      });
    }
    return res.status(201).json({
      message: "Thanks For your Feedback",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 8 } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    if (!userId) {
      return res.status(400).json({
        error: "User Id is required",
      });
    }
    const user = await prisma.user.findMany({
      where: {
        id: parseInt(userId),
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const userPayments = await prisma.rental.findMany({
      where: {
        userId: userId,
      },
      select: {
        payment: {
          select: {
            amount: true,
            id: true,
            method: true,
            paidAt: true,
            status: true,
          },
        },
        car: {
          select: {
            make: true,
            model: true,
            year: true,
          },
        },
      },
      skip,
      take: limitInt,
    });

    if (!userPayments) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    if (!userPayments) {
      return res.status(400).json({
        error: "No rentals found",
      });
    }
    return res.status(200).json({
      data: userPayments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getCompletedRentals = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 8 } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;
    if (!userId) {
      return res.status(400).json({
        error: "User id is required",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const reviews = await prisma.review.findMany({
      where: {
        userId: userId,
      },
      select: {
        carId: true,
      },
    });

    const rentals = await prisma.rental.findMany({
      where: {
        userId: userId,
        status: "COMPLETED",
      },

      select: {
        car: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            featuredImage: true,
          },
        },

        id: true,
        startDate: true,
        endDate: true,
        pickupTime: true,
        returnTime: true,
        totalCost: true,
        status: true,
      },
      skip,
      take: limitInt,
    });
    const completedRentals = rentals.filter(
      (rental) => rental.status === "COMPLETED"
    );
    const nonReviewedRentals = completedRentals.filter(
      (rental) => !reviews.find((review) => review.carId === rental.car.id)
    );

    if (!rentals) {
      return res.status(400).json({
        error: "No rentals found",
      });
    }
    const totalRents = await prisma.rental.count({
      where: {
        userId: userId,
        status: "COMPLETED",
      },
    });
    return res.status(200).json({
      data: nonReviewedRentals,
      page: pageInt,
      limit: limitInt,
      totalPages: Math.ceil(totalRents / limit),
      totalRents: totalRents,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
