import cron from 'node-cron';
import { createNotification } from '../services/notification.services';
import { xata } from '../server';
import { Task } from '../types/task.types';


/**
 * Fetches all tasks that are currently in progress from the database.
 *
 * @returns {Promise<Array<Task> | null>} A promise that resolves to an array of in-progress tasks if any exist, or null if no tasks are in progress or an error occurs.
 */
const fetchInProgressTasks = async () => {
    try {
        const inProgressTasks = await xata.db.Task.filter({ status: 'in-progress' }).getAll();

        if (inProgressTasks.length > 0) {
            return inProgressTasks;
        }

        return null;
    } catch (error: any) {
        return null
    }
}

/**
 * Asynchronously creates notifications for tasks based on their due dates.
 * 
 * This function fetches tasks that are currently in progress and checks their due dates.
 * If a task is due within the next two days, a notification is created to alert the assigned user.
 * If a task is overdue, a notification is created to inform the user that the task has been set to backlog.
 * 
 * @returns {Promise<void>} A promise that resolves when the notifications have been created.
 * 
 * @throws Will log an error message if an error occurs during the process.
 */
const createNotificationOnTasks = async () => {
    try {
        const currentDate = new Date();

        const tasks = await fetchInProgressTasks();

        if (!tasks) return;

        tasks.forEach((task) => {
            let dateDifference = task.dueDate.getDate() - currentDate.getDate();

            if (dateDifference >= 0 && dateDifference <= 2) {
                const notificationMessage = `${task.description} is almost due`;

                createNotification(notificationMessage, task.assignedToId.toString());
            }

            if (dateDifference < 0) {
                const notificationMessage = `${task.description} set to backlog!`;

                createNotification(notificationMessage, task.assignedToId.toString());
            }
        })

    } catch (error: any) {
        console.log(error.toString());
    }
}

/**
 * Schedules a cron job to create notifications for tasks.
 * 
 * The job is scheduled to run at midnight every day ("0 0 * * *").
 * The job is not started automatically upon creation (`scheduled: false`).
 * 
 * @constant {CronJob} createNotificationsJob - The scheduled cron job for creating task notifications.
 */
export const createNotificationsJob = cron.schedule("0 0 * * *", createNotificationOnTasks, {
    scheduled: false,
});
