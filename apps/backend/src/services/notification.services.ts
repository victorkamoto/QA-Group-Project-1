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

/**
 * Fetches all notifications for a specific user.
 *
 * @param userId - The ID of the user whose notifications are to be fetched.
 * @returns An object containing the status code, a message, and the details of the notifications or an error message.
 * @throws Will return a server error message if the operation fails.
 */
export const fetchAllUserNotifications = async (userId: string) => {
    try {
        const notifications = await xata.db.Notification.filter({ userId }).getAll();

        if (notifications.length === 0) {
            return {
                code: 404,
                message: 'Notifications not found!',
                details: `No notifications found for user with id ${userId}!`
            }
        }

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

export const fetchNotificationById = async (notificationId: string) => {
    try {
        const notification = await xata.db.Notification.filter({ xata_id: notificationId }).getFirst();

        if (!notification) {
            return {
                code: 404,
                message: 'Notification not found!',
                details: `Notification with id ${notificationId} not found!`
            }
        }

        return {
            code: 200,
            message: 'Notification fetched successfully!',
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

/**
 * Deletes a notification by its ID.
 *
 * @param {string} notificationId - The ID of the notification to delete.
 * @returns {Promise<{code: number, message: string, details: any}>} - A promise that resolves to an object containing the status code, message, and details of the operation.
 *
 * @example
 * const response = await deleteNotification('12345');
 * if (response.code === 200) {
 *     console.log('Notification deleted:', response.details);
 * } else {
 *     console.error('Error:', response.message);
 * }
 *
 * @throws {Error} - Throws an error if there is a server issue.
 */
export const deleteNotification = async (notificationId: string) => {
    try {
        const notification = await xata.db.Notification.filter({ xata_id: notificationId }).getFirst();

        if (!notification) {
            return {
                code: 404,
                message: 'Notification not found!',
                details: `Notification with id ${notificationId} not found!`
            }
        }

        const result = await xata.db.Notification.delete({ xata_id: notificationId });

        if (!result) {
            return {
                code: 404,
                message: 'Notification not found!',
                details: `Notification with id ${notificationId} not found!`
            }
        }

        return {
            code: 200,
            message: 'Notification deleted successfully!',
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
