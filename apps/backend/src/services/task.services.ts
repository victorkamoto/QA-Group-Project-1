import { decodeBase64 } from "bcryptjs";
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
 *   dueDate: '2023-12-31',
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

/**
 * Fetches a task by its ID from the database.
 *
 * @param {string} id - The ID of the task to fetch.
 * @returns {Promise<{code: number, message: string, details: any}>} - A promise that resolves to an object containing the status code, message, and task details or error information.
 *
 * @example
 * const result = await fetchTaskByid('12345');
 * if (result.code === 200) {
 *     console.log('Task found:', result.details);
 * } else {
 *     console.log('Error:', result.message);
 * }
 *
 * @throws {Error} - Throws an error if the database query fails.
 */
export const fetchTaskByid = async (id: string) => {
    try {
        const task = await xata.db.Task.filter({ xata_id: id }).getFirst();

        if (!task) {
            return {
                code: 404,
                message: 'task not found!',
                details: 'task with id \`${id}\` not found!'
            }
        }

        return {
            code: 200,
            message: 'task found!',
            details: task
        }
    } catch (error: any) {
        return error.toString();
    }
}

/**
 * Updates a task with the given taskId and body.
 *
 * @param {string} taskId - The ID of the task to update.
 * @param {UpdateTask} body - The data to update the task with.
 * @returns {Promise<{ code: number, message: string, details: any }>} - The result of the update operation.
 *
 * @throws {Error} - Throws an error if the update operation fails.
 */
export const updateTask = async (taskId: string, body: UpdateTask) => {
    try {
        const task = await xata.db.Task.filter({ xata_id: taskId }).getFirst();

        if (!task) {
            return {
                code: 400,
                message: 'Error updating task!',
                details: `Task with id ${taskId} does not exist.`
            }
        }

        if (body.status && !isValidStatus(body.status)) {
            return {
                code: 400,
                message: 'Error updating task',
                details: `status must be 'in-progress' or 'completed'!`
            }
        }

        const result = await xata.db.Task.update(taskId, body);

        return {
            code: 200,
            message: 'Task updated successfully',
            details: result
        }

    } catch (error: any) {
        return {
            code: 500,
            message: 'Internal server error',
            details: error.toString()
        };
    }
}

/**
 * Deletes a task from a project based on the provided task ID.
 *
 * @param {string} taskId - The ID of the task to be deleted.
 * @returns {Promise<{ code: number, message: string, details: any }>} - A promise that resolves to an object containing the status code, message, and details of the operation.
 *
 * @example
 * const response = await deleteTaskFromProject('task-id-123');
 * if (response.code === 200) {
 *     console.log(response.message); // Task deleted successfully
 * } else {
 *     console.error(response.message); // Error deleting task
 * }
 */
export const deleteTaskFromProject = async (taskId: string) => {
    try {
        const task = await xata.db.Task.filter({ xata_id: taskId }).getFirst();

        if (!task) {
            return {
                code: 404,
                message: 'Error deleting task',
                details: `Task with id ${taskId} does not exist!`
            }
        }

        const result = await xata.db.Task.delete(taskId);

        return {
            code: 200,
            message: 'Task deleted successfully',
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
 * Updates the status of a task.
 *
 * @param {string} taskId - The ID of the task to update.
 * @param {string} status - The new status of the task. Must be either 'in-progress' or 'completed'.
 * @returns {Promise<{code: number, message: string, details: any}>} - An object containing the status code, message, and details of the operation.
 *
 * @throws {Error} - Throws an error if there is an issue with the database operation.
 */
export const updateTaskStatus = async (taskId: string, status: string) => {
    try {
        if (!isValidStatus(status)) {
            return {
                code: 400,
                message: 'Invalid status!',
                details: `status must be 'in-progress' or 'completed'!`
            }
        }

        const task = await xata.db.Task.filter({ xata_id: taskId }).getFirst();

        if (!task) {
            return {
                code: 404,
                message: 'Error updating task',
                details: `Task with id ${taskId} does not exist!`
            }
        }

        const result = await xata.db.Task.update(taskId, { status });

        return {
            code: 200,
            message: 'Task status updated successfully',
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
