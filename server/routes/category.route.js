import { Router } from "express";
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/category.controller.js";
import { verifyAdmin, verifyAuthentication } from "../auth/verifyCookie.js";

const categoryRouter = Router();

categoryRouter.get("/categories", getAllCategories);
categoryRouter.post("/add", verifyAuthentication, verifyAdmin, addCategory);
categoryRouter.delete("/delete", verifyAuthentication ,verifyAdmin, deleteCategory)
categoryRouter.put("/update" ,verifyAuthentication, verifyAdmin ,updateCategory)

export default categoryRouter;
