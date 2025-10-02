import { Router } from "express";

import { verifyAdmin, verifyAuthentication } from "../auth/verifyCookie.js";

import {
  cancelBooking,
  dashboardFleetDistribution,
  dashboardMetrics,
  dashboardRevenueOverview,
  dashboardTopPerformingVehicles,
  deleteCar,
  getAllUsers,
  getBookings,
  getBookingsDetails,
  getCarsToTrack,
  getRecentBookings,
  getUserById,
  getUsersReviews,
  listStaffUsers,
  softDeleteUser,
  updateUser,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get("/users", verifyAuthentication, verifyAdmin, getAllUsers);
adminRouter.get("/user", verifyAuthentication, verifyAdmin, getUserById);
adminRouter.put("/update-user", verifyAuthentication, verifyAdmin, updateUser);
adminRouter.get("/bookings", verifyAuthentication, verifyAdmin, getBookings);
adminRouter.get(
  "/metrics",
  verifyAuthentication,
  verifyAdmin,
  dashboardMetrics
);
adminRouter.get(
  "/revenue-chart-data",
  verifyAuthentication,
  verifyAdmin,
  dashboardRevenueOverview
);
adminRouter.get(
  "/fleet-distribution",
  verifyAuthentication,
  verifyAdmin,
  dashboardFleetDistribution
);
adminRouter.get(
  "/top-performing-vechicles",
  verifyAuthentication,
  verifyAdmin,

  dashboardTopPerformingVehicles
);
adminRouter.get(
  "/recent-bookings",
  verifyAuthentication,
  verifyAdmin,
  getRecentBookings
);
adminRouter.get(
  "/bookings-details",
  verifyAuthentication,
  verifyAdmin,
  getBookingsDetails
);
adminRouter.delete(
  "/cancel-booking",
  verifyAuthentication,
  verifyAdmin,
  cancelBooking
);
adminRouter.delete("/delete-car", verifyAuthentication, verifyAdmin, deleteCar);
adminRouter.get(
  "/cars-to-track",
  verifyAuthentication,
  verifyAdmin,
  getCarsToTrack
);
adminRouter.put(
  "/soft-delete-user",
  verifyAuthentication,
  verifyAdmin,
  softDeleteUser
);
adminRouter.get(
  "/get-staff-users",
  verifyAuthentication,
  verifyAdmin,
  listStaffUsers
);
adminRouter.get(
  "/get-reviews",
  verifyAuthentication,
  verifyAdmin,
  getUsersReviews
);
export default adminRouter;
