import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { UpdateTask } from "../types/task.types";
import {
    createTask,
    fetchTasks,
    fetchTaskByid,
    fetchTaskByUserId,
    updateTask,
    deleteTaskFromProject,
    updateTaskStatus
} from "../services/task.services";


/**
 * Creates a new task.
 * 
 * This function handles the creation of a new task by validating the request,
 * invoking the `createTask` service, and sending the appropriate response.
 * 
 * @param req - The request object containing the task data.
 * @param resp - The response object used to send the response.
 * 
 * @returns A JSON response with the status code and message.
 * 
 * @throws Will return a 500 status code and error message if an exception occurs.
 */
export const create = async (req: Request, resp: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return resp.status(400).json({ errors: errors.array() });
        }

        const { code, message, details } = await createTask(req.body);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves tasks and sends them in the response.
 *
 * @param req - The request object.
 * @param resp - The response object.
 * @returns A promise that resolves to sending the tasks in the response.
 *
 * @throws Will send a 500 status code with the error message if an error occurs.
 */
export const getTasks = async (req: Request, resp: Response) => {
    try {
        const tasks = await fetchTasks();

        resp.json(tasks);
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }

}
/**
 * Retrieves a task by its ID.
 *
 * @param req - The request object containing the task ID in the parameters.
 * @param resp - The response object used to send the status and JSON data.
 *
 * @returns A promise that resolves to a JSON response containing the task details or an error message.
 *
 * @throws Will return a 500 status code and an error message if an exception occurs.
 */
export const getTaskById = async (req: Request, resp: Response) => {
    try {
        const { code, message, details } = await fetchTaskByid(req.params.id);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves tasks assigned to a user.
 *
 * @param req - The request object containing the user ID in the parameters.
 * @param resp - The response object used to send the status and JSON data.
 *
 * @returns A promise that resolves to a JSON response containing the tasks assigned to the user.
 *
 * @throws Will return a 500 status code and an error message if an exception occurs.
 */
export const getTasksByUserId = async (req: Request, resp: Response) => {
    try {
        const { code, message, details } = await fetchTaskByUserId(req.params.id);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Updates a task with the given ID using the provided request body.
 *
 * @param req - The request object containing the task ID in the parameters and the update data in the body.
 * @param resp - The response object used to send back the status and result of the update operation.
 *
 * @returns A promise that resolves to a JSON response with the status code, message, and details of the update operation.
 *
 * @throws Will return a 500 status code and an error message if the update operation fails.
 */
export const update = async (req: Request, resp: Response) => {
    const id: string = req.params.id;
    const body: UpdateTask = req.body;

    try {
        const { code, message, details } = await updateTask(id, body);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Deletes a task from a project.
 *
 * @param req - The request object containing the task ID in the parameters.
 * @param resp - The response object used to send the status and JSON response.
 *
 * @returns A JSON response with the status code, message, and details of the deletion operation.
 *
 * @throws Will return a 500 status code and error message if an exception occurs during the deletion process.
 */
export const deleteTask = async (req: Request, resp: Response) => {
    try {
        const { code, message, details } = await deleteTaskFromProject(req.params.id);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Updates the status of a task.
 *
 * @param req - The request object containing the task ID in the parameters and the new status in the body.
 * @param resp - The response object used to send the status code and JSON response.
 *
 * @returns A promise that resolves to a JSON response with the status code, message, and details of the update operation.
 *
 * @throws Will return a 500 status code and error message if an error occurs during the update process.
 */
export const updateStatus = async (req: Request, resp: Response) => {
    try {
        const { code, message, details } = await updateTaskStatus(req.params.id, req.body.status);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}
