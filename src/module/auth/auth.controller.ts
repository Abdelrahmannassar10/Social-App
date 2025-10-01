import { Router } from "express";
import AuthService from "./auth.service";
import { isValid } from "../../middleware";
import * as authValidation from "./auth.validation" ;
import authService from "./auth.service";
const router = Router();
router.post("/register", isValid(authValidation.registerSchema),AuthService.register);
router.post("/login",authService.login)
router.post("/verify-account",AuthService.verifyAccount);
export default router;