import { Router } from "express";
import {
  loginUser,
  registerWithOtp,
  registerWithoutOtp,
  verifyOtp,
} from "../controllers/user.controller";

const router = Router();

router.route("/registration-without-otp").post(registerWithoutOtp);

router.route("/registration-with-otp").post(registerWithOtp);

router.route("/verify-otp").patch(verifyOtp);

router.route("/login").post(loginUser);

export default router;
