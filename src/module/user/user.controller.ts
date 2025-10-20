import { Router } from "express";
import userService from "./user.service"
import { isAuthenticated, isValid } from "../../middleware";
import { acceptRequestSchema, addFriendSchema, blockUserSchema } from "./user.validation";
const router =Router()
router.get("/",isAuthenticated(),userService.getProfile)
router.post("/add-friend",isAuthenticated(),isValid(addFriendSchema),userService.addFriend)
router.get("/show-request",isAuthenticated(),userService.showRequest)
router.post("/accept-request",isAuthenticated(),isValid(acceptRequestSchema),userService.acceptRequest)
router.post("/block/",isAuthenticated(),isValid(blockUserSchema),userService.blockUser)
router.post("/deleteFriendRequest/:id",isAuthenticated(),userService.deleteFriendRequest)
router.put("/unfriend/:id",isAuthenticated(),userService.unfriend)

export default router ;