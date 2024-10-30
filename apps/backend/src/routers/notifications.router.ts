import { Router } from "express";
import { asyncHandler } from "../utils";
import {
    getUserNotifications,
    getNotificationById,
    deleteNotificationById,
    getAllNotifications
} from "../controllers/notifications.controller";

const notificationRouter = Router();

notificationRouter.get('/:id', asyncHandler(getNotificationById));
notificationRouter.get('/', asyncHandler(getAllNotifications));
notificationRouter.get('/search', asyncHandler(getUserNotifications));
notificationRouter.delete('/:id', asyncHandler(deleteNotificationById));

export default notificationRouter;
