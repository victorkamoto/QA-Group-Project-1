import { Router } from "express";
import { asyncHandler } from "../utils";
import { getUserNotifications } from "../controllers/notifications.controller";

const notificationRouter = Router();

notificationRouter.get('/:userId', asyncHandler(getUserNotifications));

export default notificationRouter;
