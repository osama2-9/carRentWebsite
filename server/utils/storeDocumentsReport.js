import prisma from "../DB/prisma/prismaClient.js";

export const storeDocumentsReport = async (userId, report) => {
  try {
    const storeReport = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: {
        ValidationReport: report,
        updatedAt: new Date(),
      },
    });

    if (storeReport) {
      return true;
    } else {
      throw new Error("Feaild to store report");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
