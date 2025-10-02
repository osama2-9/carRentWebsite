import { Router } from "express";
import {
  changeMyPassword,
  
  getMyProfile,
  login,
  logout,
  me,
  refresh,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { verifyAuthentication } from "../auth/verifyCookie.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/me", verifyAuthentication, me);
authRouter.get("/profile", verifyAuthentication, getMyProfile);
authRouter.post("/change-password", verifyAuthentication, changeMyPassword);
authRouter.put("/profile", verifyAuthentication, updateProfile);
authRouter.post("/refresh", refresh);
export default authRouter;
