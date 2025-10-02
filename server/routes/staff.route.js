import express from "express";
import { verifyAuthentication, verifyStaff } from "../auth/verifyCookie.js";
import {
  getRentalContracts,
  getRentalRequests,
  getUsresData,
  markRentalAsCompleted,
  verifyContract,
  verifyCustomerDocuments,
} from "../controllers/staff.controller.js";

const staffRouter = express.Router();

staffRouter.get("/users", verifyAuthentication, verifyStaff, getUsresData);
staffRouter.post(
  "/verify-customer-document",
  verifyStaff,
  verifyCustomerDocuments
);
staffRouter.get(
  "/get-rentals-requests",
  verifyAuthentication,
  verifyStaff,
  getRentalRequests
);
staffRouter.post(
  "/mark-rental-as-completed",
  verifyAuthentication,
  verifyStaff,
  markRentalAsCompleted
);
staffRouter.get(
  "/get-rental-contracts",
  verifyAuthentication,
  verifyStaff,
  getRentalContracts
);
staffRouter.post(
  "/verify-contract",
  verifyAuthentication,
  verifyStaff,
  verifyContract
);

export default staffRouter;
