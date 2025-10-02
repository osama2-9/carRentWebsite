import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../DB/prisma/prismaClient.js";
dotenv.config();

export const verifyAuthentication = (req, res, next) => {
  const token = req.cookies.auth;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.auth;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    const { id } = decoded;
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        role: true,
      },
    });

    if (user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded;
    next();
  });
};
export const verifyUser = (req, res, next) => {
  const token = req.cookies.auth;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (decoded.role !== "CUSTOMER") {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded;
    next();
  });
};

export const verifyStaff = (req, res, next) => {
  const token = req.cookies.auth;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (decoded.role !== "STAFF") {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded;
    next();
  });
};
