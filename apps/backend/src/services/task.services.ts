import { xata } from "../server";
import { NewTask, UpdateTask, isValidStatus } from "../types/task.types";

/**
 * Creates a new task in the database.
 * 
 * @param {NewTask} task - The task object containing the details of the task to be created.
 * @param {string} task.description - The description of the task.
 * @param {string} task.status - The status of the task, must be 'in-progress' or 'completed'.
 * @param {string} task.dueDate - The due date of the task in ISO string format.
 * @param {string} task.projectId - The ID of the project to which the task belongs.
 * @param {string} task.assignedToId - The ID of the user to whom the task is assigned.
 * 
 * @returns {Promise<{code: number, message: string, details: any}>} - A promise that resolves to an object containing the status code, message, and details of the operation.
 * 
 * @throws {Error} - Throws an error if there is an issue with the database operation.
 * 
 * @example
 * const newTask = {
 *   description: 'Complete the report',
 *   status: 'in-progress',
 *   dueDate: '2023-12-31T23:59:59.999Z',
 *   projectId: 'project123',
 *   assignedToId: 'user456'
 * };
 * 
 * createTask(newTask)
 *   .then(response => {
 *     console.log(response);
 *   })
 *   .catch(error => {
 *     console.error(error);
 *   });
 */
export const createTask = async (task: NewTask) => {
    const { description, status, dueDate, projectId, assignedToId } = task;

    try {
        // check if project exists
        const project = xata.db.Project.filter({ xata_id: projectId }).getFirst();

        if (!project) {
            return {
                code: 404,
                message: 'Error creating Task',
                details: `Project with id ${projectId} does not exist!`
            }
        }

        // check if user to assign to exists
        const user = xata.db.User.filter({ xata_id: assignedToId }).getFirst();

        if (!user) {
            return {
                code: 404,
                message: 'Error creating Task',
                details: `User with id ${assignedToId} does not exist!`
            }
        }

        // validate status
        if (!isValidStatus(status)) {
            return {
                code: 400,
                message: 'Invalid status!',
                details: `status must be 'in-progress' or 'completed'!`
            }
        }

        const existingTask = await xata.db.Task.filter({ description: description.toLowerCase() }).getFirst();

        if (existingTask) {
            return {
                code: 409,
                message: 'Error creating Task',
                details: 'Tasks already exists.'
            }
        }

        const parsedDueDate = new Date(dueDate);

        const result = await xata.db.Task.create({
            description: description.toLowerCase(),
            status: status.toLowerCase(),
            dueDate: parsedDueDate.toISOString(),
            projectId, assignedToId
        });

        return {
            code: 201,
            message: 'Task created successfully',
            details: result
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Internal server error',
            details: error.toString()
        }
    }
}


/**
 * Fetches all tasks from the database.
 *
 * @returns {Promise<{ code: number, message: string, details: any }>} 
 * An object containing the status code, message, and details of the fetched tasks or error.
 *
 * @throws {Error} If there is an issue with fetching tasks from the database.
 */
export const fetchTasks = async () => {
    try {
        const tasks = await xata.db.Task.getAll();

        return tasks;
    } catch (error: any) {
        return error.toString();
    }
}
