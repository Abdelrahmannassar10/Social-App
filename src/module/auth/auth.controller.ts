import { Router } from "express";
import AuthService from "./auth.service";
const router = Router();
router.post("/register", AuthService.register);
export default router;