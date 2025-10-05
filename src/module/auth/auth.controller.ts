import { Router } from "express";
import AuthService from "./auth.service";
import { isAuthenticated, isValid } from "../../middleware";
import * as authValidation from "./auth.validation" ;
import authService from "./auth.service";
const router = Router();
router.post("/register", isValid(authValidation.registerSchema),AuthService.register);
router.post("/login",isValid(authValidation.loginSchema),authService.login)
router.post("/verify-account",isValid(authValidation.verifyAccountSchema),AuthService.verifyAccount);
router.post("/update-password",isAuthenticated(),isValid(authValidation.updatePasswordSchema),AuthService.updatePassword);
router.post("/update-info",isAuthenticated(),isValid(authValidation.updatePasswordSchema),AuthService.updateInfo);
export default router;