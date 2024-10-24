import { Request, Response } from "express";
import { fetchAllUserNotifications } from "../services/notification.services";

/**
 * Fetches all notifications for a user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<Response>} - A promise that resolves to the response object.
 */
export const getUserNotifications = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.params.userId;
        const { code, message, details } = await fetchAllUserNotifications(userId);

        return res.status(code).json({ message, details });
    } catch (error: any) {
        return res.status(500).json({ error: error.toString() });
    }
}
