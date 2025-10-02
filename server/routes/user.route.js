import express from "express";
import { verifyAuthentication, verifyUser } from "../auth/verifyCookie.js";
import {
  getCompletedRentals,
  getDocuments,
  getMyPayments,
  getMyRentals,
  getNextRental,
  rentCarRequest,
  requestSignOnContract,
  searchCars,
  signByEmail,
  startTracking,
  submitReview,
  updateLocation,
  verifyDocuments,
  viewMyRentals,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/search", searchCars);
userRouter.post(
  "/verify-documents",
  verifyAuthentication,
  verifyUser,
  verifyDocuments
);
userRouter.post(
  "/rent-car-request",
  verifyAuthentication,
  verifyUser,
  rentCarRequest
);
userRouter.get(
  "/get-my-rents",
  verifyAuthentication,
  verifyUser,
  viewMyRentals
);
userRouter.get(
  "/get-next-rental",
  verifyAuthentication,
  verifyUser,
  getNextRental
);
userRouter.post(
  "/request-sign-on-contract",
  verifyAuthentication,
  verifyUser,
  requestSignOnContract
);
userRouter.post("/sign", verifyAuthentication, verifyUser, signByEmail);
userRouter.post(
  "/start-track",
  verifyAuthentication,
  verifyUser,
  startTracking
);
userRouter.post(
  "/update-location",
  verifyAuthentication,
  verifyUser,
  updateLocation
);
userRouter.get(
  "/get-documents",
  verifyAuthentication,
  verifyUser,
  getDocuments
);
userRouter.get("/my-rents", verifyAuthentication, verifyUser, getMyRentals);
userRouter.post(
  "/submit-review",
  verifyAuthentication,
  verifyUser,
  submitReview
);
userRouter.get(
  "/get-my-payment",
  verifyAuthentication,
  verifyUser,
  getMyPayments
);
userRouter.get(
  "/get-completed-rentals",
  verifyAuthentication,
  verifyUser,
  getCompletedRentals
);

export default userRouter;
