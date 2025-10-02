import {
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
} from "../auth/setCookie.js";
import prisma from "../DB/prisma/prismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      phone,
      dateOfBirth,
      nationality,
      rememberMe,
    } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !gender ||
      !phone ||
      !dateOfBirth ||
      !nationality
    ) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gender,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        createdAt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "error while signing up",
      });
    }
    const accessToken = createAccessToken(user);
    let refreshToken = null;

    if (rememberMe) {
      refreshToken = createRefreshToken(user);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = createAccessToken(user);
    let refreshToken = null;

    if (rememberMe) {
      refreshToken = createRefreshToken(user);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const me = (req, res) => {
  try {
    const token = req.cookies["auth"];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.json({
      isAuthenticated: true,
      user: {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch (error) {
    return res.json({ isAuthenticated: false });
  }
};
export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshAuth;
  if (!refreshToken)
    return res.status(401).json({
      message: "Unauthorized",
    });

  try {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!storedToken) return res.status(403).json({ message: "Forbidden" });

    if (storedToken.expiryDate < new Date()) {
      await prisma.refreshToken.delete({ where: { token: refreshToken } });
      return res.status(403).json({ message: "Refresh token expired" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err)
          return res.res.status(403).json({
            message: "Forbidden",
          });

        const dbUser = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, role: true, email: true, name: true },
        });
        if (!dbUser)
          return res.status(404).json({
            message: "User not found",
          });

        const newAccessToken = createAccessToken(dbUser);
        const newRefreshToken = createRefreshToken(dbUser);

        await prisma.refreshToken.update({
          where: { token: refreshToken },
          data: {
            token: newRefreshToken,
            expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });

        setAuthCookies(res, newAccessToken, newRefreshToken);

        return res.json({
          success: true,
          user: {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
          },
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshAuth;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }
    res.clearCookie("refreshAuth");
    res.clearCookie("auth");
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        nationality: true,
        dateOfBirth: true,
        gender: true,
        documentsVerified: true,
        passportUrl: true,
        driverLicenseUrl: true,
        proofOfAddressUrl: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};
export const changeMyPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        error: "Please Fill all fields ",
      });
    }
    const prevPassword = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        password: true,
      },
    });
    if (!prevPassword) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      prevPassword.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Invalid password",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, dateOfBirth, nationality, gender } = req.body;
    const userId = req.user.id;
    if (!name || !phone || !dateOfBirth || !nationality || !gender) {
      return res.status(400).json({
        error: "Please Fill all fields ",
      });
    }

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        phone,
        dateOfBirth,
        nationality,
        gender,
      },
    });
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
