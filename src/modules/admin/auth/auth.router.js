import { Router } from "express";
import {
  login,
  refreshToken,
  logout,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
} from "./auth.controller.js";
import { validate } from "../../../middleware/validate.schema.js";
import {
  loginValidationSchema,
  updateProfileValidationSchema,
  changePasswordValidationSchema,
} from "./auth.validation.js";
import { isAuthenticated } from "../../../middleware/isAuth.js";
import { changePasswordLimiter , profileLimiter } from "../../../middleware/rateLimiter.js";
const router = Router();

//login route
router.post("/login", validate(loginValidationSchema), login);
//refresh token route
router.post("/refresh-token", refreshToken);
//logout route
router.post("/logout", logout);
//get admin profile route
router.get("/profile", isAuthenticated , profileLimiter , getAdminProfile);
// update admin profile
router.put(
  "/profile",
  isAuthenticated,
  validate(updateProfileValidationSchema),
  updateAdminProfile,
);
// change password
router.post(
  "/change-password",
  isAuthenticated,
  changePasswordLimiter ,
  validate(changePasswordValidationSchema),
  changePassword,
);
export default router;
