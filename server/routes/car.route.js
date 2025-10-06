import { Router } from "express";
import {
  addNewCar,
  filterCars,
  getAllCars,
  getCarDetailsById,
  getCarsMake,
  getSoftDeletedCars,
  markAsRented,
  restoreDeletedCar,
  updateCar,
} from "../controllers/car.controller.js";
import { verifyAdmin } from "../auth/verifyCookie.js";

const CarRouter = Router();
CarRouter.post("/add-new-car", verifyAdmin, addNewCar);
CarRouter.put("/update-car", verifyAdmin, updateCar);
CarRouter.get("/make", getCarsMake);
CarRouter.get("/get-all-cars", getAllCars);
CarRouter.get("/get-car", getCarDetailsById);
CarRouter.post("/restore-car", verifyAdmin, restoreDeletedCar);
CarRouter.get("/get-soft-deleted-cars", verifyAdmin, getSoftDeletedCars);
CarRouter.put("/mark-as-rented", verifyAdmin, markAsRented);
CarRouter.get("/filter", filterCars);
export default CarRouter;
