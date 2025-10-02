import prisma from "../DB/prisma/prismaClient.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.carCategory.findMany({
      select: {
        id: true,
        name: true,
        dailyRate: true,
      },
    });
    if (!categories) {
      [];
    }
    return res.status(200).json({
      categories: categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, dailyRate } = req.body;
    if (!name || !dailyRate) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    const category = await prisma.carCategory.create({
      data: {
        name,
        dailyRate: parseFloat(dailyRate),
      },
    });
    if (!category) {
      return res.status(400).json({
        error: "Can't add category",
      });
    }
    return res.status(200).json({
      message: "Category added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId, name, dailyRate } = req.body;
    if (!name || !dailyRate) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    const category = await prisma.carCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        dailyRate,
      },
    });
    if (!category) {
      return res.status(400).json({
        error: "Can't update category",
      });
    }
    return res.status(200).json({
      message: "Category updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      return res.status(400).json({
        error: "Category id is required",
      });
    }
    const category = await prisma.carCategory.delete({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      return res.status(400).json({
        error: "Can't delete category",
      });
    }
    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
