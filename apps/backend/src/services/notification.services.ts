import { xata } from "../server";

/**
 * Creates a notification for a user.
 *
 * @param {string} message - The message content of the notification.
 * @param {string} userId - The ID of the user to whom the notification is assigned.
 * @returns {Promise<{ code: number, message: string, details: any }>} - A promise that resolves to an object containing the status code, message, and details of the operation.
 *
 * @throws {Error} - Throws an error if there is a server error during the operation.
 */
export const createNotification = async (message: string, userId: string) => {
    try {
        const user = await xata.db.Task.filter({ assignedToId: userId }).getFirst();

        if (!user) {
            return {
                code: 400,
                message: 'Notification creation error!',
                details: `User with id ${userId} is not assigned to the task!`
            }
        }

        const notification = await xata.db.Notification.create({ message, userId });

        return {
            code: 201,
            message: 'Notification created!',
            details: notification
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Server error!',
            details: error.toString()
        }
    }
}

export const fetchAllUserNotifications = async (userId: string) => {
    try {
        const notifications = await xata.db.Notification.filter({ userId }).getAll();

        return {
            code: 200,
            message: 'Notifications fetched successfully!',
            details: notifications
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Server error!',
            details: error.toString()
        }
    }
}
