import { Request, Response } from "express";
import { fetchAllUserNotifications, fetchNotificationById } from "../services/notification.services";

/**
 * Fetches all notifications for a user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - A promise that resolves to the response object.
 */
export const getUserNotifications = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.query.userId?.toString() || '';

        const { code, message, details } = await fetchAllUserNotifications(userId);

        return res.status(code).json({ message, details });
    } catch (error: any) {
        return res.status(500).json({ error: error.toString() });
    }
}

export const getNotificationById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const notificationId = req.params.id;

        const { code, message, details } = await fetchNotificationById(notificationId);

        return res.status(code).json({ message, details });
    } catch (error: any) {
        return res.status(500).json({ error: error.toString() });
    }
}
