import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { createTask, fetchTasks } from "../services/task.services";


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
