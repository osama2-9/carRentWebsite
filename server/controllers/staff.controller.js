import prisma from "../DB/prisma/prismaClient.js";

export const verifyCustomerDocuments = async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) {
      return res.status(400).json({
        error: "Customer Id is requried",
      });
    }
    const findCustomer = await prisma.user.findUnique({
      where: {
        id: parseInt(customerId),
      },
      select: {
        role: true,
      },
    });

    if (!findCustomer || findCustomer.role != "CUSTOMER") {
      return res.status(400).json({
        error: "Can't find customer",
      });
    }

    const updateCustomerStatus = await prisma.user.update({
      where: {
        id: parseInt(customerId),
      },
      data: {
        documentsVerified: true,
      },
    });
    if (!updateCustomerStatus) {
      return res.status(400).json({
        error: "Can't update customer data",
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

export const getUsresData = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;

    const users = await prisma.user.findMany({
      skip,
      take: limitInt,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        documentsVerified: true,
        dateOfBirth: true,
        gender: true,
        phone: true,
        emailVerified: true,
        driverLicenseUrl: true,
        passportUrl: true,
        proofOfAddressUrl: true,
        nationality: true,
        licenseExpiryDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalUsers = await prisma.user.count();

    return res.status(200).json({
      data: users,
      pagination: {
        currentPage: pageInt,
        totalPages: Math.ceil(totalUsers / limitInt),
        totalCount: totalUsers,
        limit: limitInt,
        hasMore: pageInt < Math.ceil(totalUsers / limitInt),
      },
    
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const getRentalRequests = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await prisma.rental.count();

    const rentalRequests = await prisma.rental.findMany({
      skip,
      take: limitNum,
      select: {
        id: true,
        car: {
          select: {
            featuredImage: true,
            id: true,
            make: true,
            model: true,
            year: true,
            licensePlate: true,
            location: {
              select: {
                googleMapsUrl: true,
                address: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
            documentsVerified: true,
            passportUrl: true,
            driverLicenseUrl: true,
            phone: true,
          },
        },
        startDate: true,
        pickupTime: true,
        endDate: true,
        returnTime: true,
        status: true,
        totalCost: true,
        payment: {
          select: {
            method: true,
            status: true,
            paidAt: true,
          },
        },
        rentalContract: {
          select: {
            contractUrl: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    return res.status(200).json({
      data: rentalRequests,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        limit: limitNum,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const markRentalAsCompleted = async (req, res) => {
  try {
    const { rentalId } = req.body
    if (!rentalId) {
      return res.status(400).json({
        error: "All fields are required"
      })
    }
    const rental = await prisma.rental.findUnique({
      where: {
        id: parseInt(rentalId)
      },

    })
    if (!rental) {
      return res.status(404).json({
        error: "Rental not found"
      })
    }
    const updateRental = await prisma.rental.update({
      where: {
        id: parseInt(rentalId)
      },
      data: {
        status: "COMPLETED"
      }
    })
    if (updateRental) {

      await prisma.car.update({
        where: {
          id: rental.carId
        },
        data: {
          available: true
        }
      })

    }
    if (!updateRental) {
      return res.status(400).json({
        error: "Failed to update rental"
      })
    }
    return res.status(200).json({
      success: true
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error"
    })

  }
}
export const getRentalContracts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const pageInt = parseInt(page)
    const limitInt = parseInt(limit)
    const skip = (pageInt - 1) * limitInt
    const totalCount = await prisma.rental.count()
    const hasMore = pageInt < Math.ceil(totalCount / limitInt)

    const contracts = await prisma.rentalContract.findMany({
      skip: skip,
      take: limitInt,
      select: {
        id: true,
        agreementAccepted: true,
        signedAt: true,
        rentalId: true,
        contractUrl: true,
        isSigned: true,
        verified: true,
        uploadedAt: true,
        signerName: true,
        signerEmail: true,
        rental: {
          select: {
            car: {
              select: {
                id: true,
                make: true,
                model: true,
                year: true,
                licensePlate: true,
                featuredImage: true,
                category: {
                  select: {
                    name: true,
                    dailyRate: true,
                  }
                },

              }

            }


          }
        }

      }
    })

    if (!contracts) {
      return res.status(404).json({
        error: "Contracts not found"
      })
    }
    return res.status(200).json({
      data: contracts,
      pagination: {
        currentPage: pageInt,
        totalPages: Math.ceil(totalCount / limitInt),
        totalCount,
        limit: limitInt,
        hasMore,
      }
    })


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error"
    })

  }
}

export const verifyContract = async (req, res) => {
  try {
    const { contractId } = req.query
    const contractIdInt = parseInt(contractId)
    const staffUserId = req.user.id
    if (!contractId) {
      return res.status(400).json({
        error: "Contract id is required"
      })
    }
    const findContract = await prisma.rentalContract.findUnique({
      where: {
        id: contractIdInt
      }
    })
    if (!findContract) {
      return res.status(404).json({
        error: "Contract not found"
      })
    }
    const updateContract = await prisma.rentalContract.update({
      where: {
        id: contractIdInt
      },
      data: {
        verified: true,
        verifiedBy: staffUserId,
        verifiedAt: new Date()
      }
    })
    if (!updateContract) {
      return res.status(400).json({
        error: "Failed to update contract"
      })
    }
    return res.status(200).json({
      success: true
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error"
    })

  }
}