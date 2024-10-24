import { Router } from "express";
import { asyncHandler } from "../utils";
import {
    getUserNotifications,
    getNotificationById
} from "../controllers/notifications.controller";

const notificationRouter = Router();

notificationRouter.get('/:id', asyncHandler(getNotificationById));
notificationRouter.get('/', asyncHandler(getUserNotifications));

export default notificationRouter;
