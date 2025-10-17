import { Router } from "express";
import userService from "./user.service"
import { isAuthenticated } from "../../middleware";
const router =Router()
router.get("/",isAuthenticated(),userService.getProfile)
router.post("/add-friend",isAuthenticated(),userService.addFriend)
router.get("/show-request",isAuthenticated(),userService.showRequest)
router.post("/accept-request",isAuthenticated(),userService.acceptRequest)

export default router ;