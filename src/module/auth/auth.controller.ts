import { Router } from "express";
import AuthService from "./auth.service";
import { isAuthenticated, isValid } from "../../middleware";
import * as authValidation from "./auth.validation" ;
import authService from "./auth.service";
const router = Router();
router.post("/register", isValid(authValidation.registerSchema),AuthService.register);
router.post("/login",isValid(authValidation.loginSchema),authService.login)
router.post("/verify-account",isValid(authValidation.verifyAccountSchema),AuthService.verifyAccount);
router.patch("/update-password",isAuthenticated(),isValid(authValidation.updatePasswordSchema),AuthService.updatePassword);
router.patch("/update-email",isAuthenticated(),isValid(authValidation.updateEmailSchema),AuthService.updatePassword);
router.patch("/update-info",isAuthenticated(),isValid(authValidation.updateInfoSchema),AuthService.updateInfo);
router.post("/confirmTwoStep",isValid(authValidation.verifyAccountSchema),AuthService.confirmTwoStep);
router.post("/verifyTwoStep",isValid(authValidation.verifyAccountSchema),AuthService.verifyTwoStep);
router.patch("/enableTwoSteps",isAuthenticated(),AuthService.enableTwoSteps);
export default router;