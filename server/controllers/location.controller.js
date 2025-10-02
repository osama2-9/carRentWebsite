import prisma from "../DB/prisma/prismaClient.js";

export const getAllLocations = async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      select: {
        id: true,
        city: true,
        address: true,
        googleMapsUrl: true,
        cars: {
          where: { isDeleted: false },
          select: {
            make: true,
            model: true,
            licensePlate: true,
            imagesUrl: true,
            available: true,
          },
        },
      },
    });
    if (!locations) {
      return [];
    }
    return res.status(200).json({
      locations: locations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateLocationData = async (req, res) => {
  try {
    const { locationId, address, city, googleMapsUrl } = req.body;
    if (!locationId || !address || !city || !googleMapsUrl) {
      return res.status(400).json({
        error: "All feailds required",
      });
    }
    const location = await prisma.location.findUnique({
      where: {
        id: locationId,
      },
    });
    if (!location) {
      return res.status(400).json({
        error: "Location not found",
      });
    }

    const updateLocation = await prisma.location.update({
      where: {
        id: locationId,
      },
      data: {
        address: address,
        city: city,
        googleMapsUrl: googleMapsUrl,
      },
    });
    if (!updateLocation) {
      return res.status(400).json({
        error: "Can't update location",
      });
    }

    return res.status(200).json({
      message: "Location updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const { locationId } = req.query;
    const locationIdInt = parseInt(locationId);
    if (!locationIdInt) {
      return res.status(400).json({
        error: "Location id is required",
      });
    }
    const location = await prisma.location.findUnique({
      where: {
        id: locationIdInt,
      },
    });
    const isLocationHasCars = await prisma.car.findFirst({
      where: {
        locationId: locationIdInt,
      },
    });

    if (isLocationHasCars) {
      return res.status(400).json({
        error: "Location has cars , can't delete location",
      });
    }
    if (!location) {
      return res.status(400).json({
        error: "Location not found",
      });
    }
    const deleteLocation = await prisma.location.delete({
      where: {
        id: locationIdInt,
      },
    });
    if (!deleteLocation) {
      return res.status(400).json({
        error: "Can't delete location",
      });
    }
    return res.status(200).json({
      message: "Location deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const addLocation = async (req, res) => {
  try {
    const { address, city, country, googleMapsUrl } = req.body;

    if (
      !address?.trim() ||
      !city?.trim() ||
      !country?.trim() ||
      !googleMapsUrl?.trim()
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!googleMapsUrl.startsWith("https://maps.app.goo.gl/")) {
      return res.status(400).json({ error: "Invalid Google Maps URL." });
    }

    const existingLocation = await prisma.location.findFirst({
      where: { address: address.trim() },
    });

    if (existingLocation) {
      return res.status(409).json({ error: "Location already exists." });
    }

    const location = await prisma.location.create({
      data: {
        address: address.trim(),
        city: city.trim(),
        country: country.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
      },
    });

    if (location) {
      return res.status(201).json({
        message: "Location added successfully",
      });
    }
  } catch (error) {
    console.error("Error creating location:", error);

    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};
