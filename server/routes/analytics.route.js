import { Router } from "express";
import { verifyAdmin } from "../auth/verifyCookie.js";
import {
  getCarCountByFuelType,
  getContractCompletionStats,
  getMonthlyRentalCount,
  getMonthlyRevenue,
  getRentalsByCity,
  getRentalStatus,
} from "../controllers/analytics.controller.js";
const analysticRoute = Router();

analysticRoute.get("/monthly-rental-count", verifyAdmin, getMonthlyRentalCount);
analysticRoute.get("/monthly-rental-revenue", verifyAdmin, getMonthlyRevenue);
analysticRoute.get("/rental-status", verifyAdmin, getRentalStatus);
analysticRoute.get("/fuel-types", verifyAdmin, getCarCountByFuelType);
analysticRoute.get(
  "/contract-completion",
  verifyAdmin,
  getContractCompletionStats
);
analysticRoute.get("/rentals-by-city", verifyAdmin, getRentalsByCity);

export default analysticRoute;
