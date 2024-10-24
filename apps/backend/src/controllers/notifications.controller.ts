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
        const userId = req.query.userId?.toString();

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required!' });
        }

        const { code, message, details } = await fetchAllUserNotifications(userId);

        return res.status(code).json({ message, details });
    } catch (error: any) {
        return res.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves a notification by its ID.
 *
 * @param req - The request object containing the notification ID in the parameters.
 * @param res - The response object used to send back the HTTP response.
 * @returns A promise that resolves to a response containing the notification details or an error message.
 *
 * @throws Will return a 500 status code with an error message if an exception occurs.
 */
export const getNotificationById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const notificationId = req.params.id;

        const { code, message, details } = await fetchNotificationById(notificationId);

        return res.status(code).json({ message, details });
    } catch (error: any) {
        return res.status(500).json({ error: error.toString() });
    }
}

