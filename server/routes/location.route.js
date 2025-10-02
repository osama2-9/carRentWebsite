import { Router } from "express";
import { addLocation, deleteLocation, getAllLocations, updateLocationData } from "../controllers/location.controller.js";
import { verifyAdmin } from "../auth/verifyCookie.js";

const locationRouter = Router();

locationRouter.get("/locations", getAllLocations);
locationRouter.delete("/delete-location", verifyAdmin,deleteLocation);
locationRouter.put("/update-location", verifyAdmin,updateLocationData);
locationRouter.post("/add-location", verifyAdmin,addLocation);

export default locationRouter;
