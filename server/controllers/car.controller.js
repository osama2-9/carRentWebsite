import prisma from "../DB/prisma/prismaClient.js";

export const addNewCar = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      licensePlate,
      fuelType,
      transmission,
      seats,
      imageUrls,
      available,
      locationId,
      categoryId,
      featuredImage,
    } = req.body;

    if (
      !make ||
      !model ||
      !year ||
      !licensePlate ||
      !fuelType ||
      !transmission ||
      !seats ||
      !imageUrls ||
      available === undefined ||
      !locationId ||
      !categoryId
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const exsistPlateNumber = await prisma.car.findUnique({
      where: {
        licensePlate: licensePlate,
      },
      select: {
        licensePlate: true,
      },
    });
    if (exsistPlateNumber) {
      return res.status(400).json({
        plate: exsistPlateNumber.licensePlate,
        error: "This plate number already exists",
      });
    }
    const newCar = await prisma.car.create({
      data: {
        make,
        model,
        year: parseInt(year),
        licensePlate,
        fuelType,
        transmission,
        seats: parseInt(seats),
        imagesUrl: imageUrls,
        available,
        locationId: parseInt(locationId),
        categoryId: parseInt(categoryId),
        featuredImage: featuredImage,
      },
    });

    if (newCar) {
      return res.status(201).json({
        success: true,
        message: "Car created successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getAllCars = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const cars = await prisma.car.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        make: true,
        model: true,
        category: {
          select: {
            id: true,
            name: true,
            dailyRate: true,
          },
        },
        location: {
          select: {
            id: true,
            city: true,
            address: true,
            googleMapsUrl: true,
          },
        },
        available: true,
        imagesUrl: true,
        fuelType: true,
        licensePlate: true,
        seats: true,
        transmission: true,
        year: true,
        createdAt: true,
        featuredImage: true,
      },

      skip: (pageInt - 1) * limitInt,
      take: limitInt,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!cars) {
      return res.status(404).json({
        error: "No cars found",
      });
    }
    const totalCars = await prisma.car.count({
      where: {
        isDeleted: false,
      },
    });
    const totalPages = Math.ceil(totalCars / limitInt);
    return res.status(200).json({
      cars: cars,
      totalCars: totalCars,
      totalPages: totalPages,
      currentPage: pageInt,
      limitPerPaga: limitInt,
      hasMoreCars: pageInt * limitInt < totalCars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { carId } = req.query;
    const {
      make,
      model,
      year,
      licensePlate,
      fuelType,
      transmission,
      seats,
      imageUrls,
      featuredImage,
      available,
      locationId,
      categoryId,
    } = req.body;
    if (
      !make ||
      !model ||
      !year ||
      !featuredImage ||
      !licensePlate ||
      !fuelType ||
      !transmission ||
      !seats ||
      !imageUrls ||
      available === undefined ||
      !locationId ||
      !categoryId
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
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
        make,
        model,
        year: parseInt(year),
        licensePlate,
        fuelType,
        transmission,
        featuredImage: featuredImage,
        seats: parseInt(seats),
        imagesUrl: imageUrls,
        available,
        locationId: parseInt(locationId),
        categoryId: parseInt(categoryId),
      },
    });
    if (!car) {
      return res.status(400).json({
        error: "Can't update car",
      });
    }
    return res.status(200).json({
      message: "Car updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const markAsRented = async (req, res) => {
  try {
    const { carId } = req.body;
    if (!carId) {
      return res.status(400).json({
        error: "Car id is required",
      });
    }
    const car = await prisma.car.update({
      where: {
        id: carId,
      },
      data: {
        available: false,
      },
    });
    if (!car) {
      return res.status(400).json({
        error: "Can't mark car as rented",
      });
    }
    return res.status(200).json({
      message: "Car marked as rented successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getCarDetailsById = async (req, res) => {
  try {
    const { carId } = req.query;
    const cardIdInt = parseInt(carId);
    if (!carId) {
      return res.status(400).json({
        error: "Car Id is required",
      });
    }
    const car = await prisma.car.findUnique({
      where: {
        id: cardIdInt,
      },
      select: {
        id: true,
        featuredImage: true,
        make: true,
        model: true,
        category: {
          select: {
            id: true,
            name: true,
            dailyRate: true,
          },
        },
        location: {
          select: {
            id: true,
            city: true,
            address: true,
            googleMapsUrl: true,
          },
        },
        available: true,
        imagesUrl: true,
        fuelType: true,
        licensePlate: true,
        seats: true,
        transmission: true,
        year: true,
      },
    });

    if (!car) {
      return res.status(404).json({
        error: "Can't load  details",
      });
    }
    return res.status(200).json({
      car,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};
export const restoreDeletedCar = async (req, res) => {
  try {
    const { carId } = req.body;
    const carIdInt = parseInt(carId);
    if (!carId) {
      return res.status(400).json({
        error: "Car Id is required",
      });
    }
    const car = await prisma.car.findUnique({
      where: {
        id: carIdInt,
      },
    });
    if (!car) {
      return res.status(400).json({
        error: "Can't find car",
      });
    }
    const restoreCar = await prisma.car.update({
      where: {
        id: carIdInt,
      },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });
    if (restoreCar) {
      return res.status(200).json({
        message: "Car has been restored",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getSoftDeletedCars = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = parseInt(pageInt - 1) * limitInt;
    const deletedCars = await prisma.car.findMany({
      where: {
        isDeleted: true,
      },
      select: {
        id: true,
        make: true,
        model: true,
        category: {
          select: {
            id: true,
            name: true,
            dailyRate: true,
          },
        },
        location: {
          select: {
            id: true,
            city: true,
            address: true,
            googleMapsUrl: true,
          },
        },
        available: true,
        imagesUrl: true,
        fuelType: true,
        licensePlate: true,
        seats: true,
        transmission: true,
        year: true,
        createdAt: true,
        featuredImage: true,
      },
      skip: skip,
      take: limitInt,
    });
    if (deletedCars.length == 0) {
      return res.status(200).json({
        data: [],
        page: pageInt,
        limit: limitInt,
      });
    }
    const totalDeletedCars = await prisma.car.count({
      where: {
        isDeleted: true,
      },
    });
    return res.status(200).json({
      data: deletedCars,
      page: pageInt,
      limit: limitInt,
      totalCars: totalDeletedCars,
      totalPages: Math.ceil(totalDeletedCars / limitInt),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
