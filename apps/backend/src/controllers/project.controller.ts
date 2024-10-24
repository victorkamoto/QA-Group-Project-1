import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
    createProject,
    fetchProjects,
    fetchProjectById,
    updateProject,
    deleteProjectFromStorage,
    fetchProjectsByTeamId
} from "../services/project.services";
import exp from "constants";

/**
 * Creates a new project.
 *
 * This function handles the creation of a new project by validating the request,
 * calling the `createProject` service, and sending the appropriate response.
 *
 * @param req - The request object containing the project data.
 * @param resp - The response object used to send the response.
 *
 * @returns A JSON response with the status code, message, and project details if successful,
 * or an error message if the request is invalid or an error occurs.
 *
 * @throws Will return a 500 status code and an error message if an exception is thrown.
 */
export const create = async (req: Request, resp: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return resp.status(400).json({ errors: errors.array() });
        }

        const { code, message, details } = await createProject(req.body);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves a list of projects and sends them as a JSON response.
 * 
 * @param req - The request object.
 * @param resp - The response object.
 * 
 * @returns A promise that resolves to a JSON response containing the list of projects.
 * 
 * @throws Will return a 500 status code and an error message if fetching projects fails.
 */
export const getProjects = async (req: Request, resp: Response) => {
    try {
        const projects = await fetchProjects();

        resp.json(projects);
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves a project by its ID.
 *
 * @param req - The request object containing the project ID in the parameters.
 * @param resp - The response object used to send the response back to the client.
 *
 * @returns A JSON response with the project details if found, or an error message if not.
 *
 * @throws Will return a 500 status code with an error message if an exception occurs.
 */
export const getProjectById = async (req: Request, resp: Response) => {
    try {
        const { code, message, details } = await fetchProjectById(req.params.id);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves projects associated with a specific team ID.
 *
 * @param req - The request object containing the team ID as a query parameter.
 * @param resp - The response object used to send back the HTTP response.
 * @returns A JSON response with the projects details or an error message.
 *
 * @remarks
 * - If the `teamId` query parameter is missing, a 400 status code with an error message is returned.
 * - If an error occurs during the process, a 500 status code with the error message is returned.
 * - The function relies on `fetchProjectsByTeamId` to fetch the projects.
 */
export const getProjectsByTeamId = async (req: Request, resp: Response) => {
    try {
        const teamId = req.query.teamId?.toString();

        if (!teamId) {
            return resp.status(400).json({ message: 'teamId is required!' });
        }

        const { code, message, details } = await fetchProjectsByTeamId(teamId);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Updates a project with the given ID using the provided request body.
 *
 * @param req - The request object containing the project ID in the parameters and the update data in the body.
 * @param resp - The response object used to send back the status and result of the update operation.
 * @returns A promise that resolves to the response status and JSON data.
 *
 * @throws Will return a 500 status code and an error message if the update operation fails.
 */
export const update = async (req: Request, resp: Response) => {
    try {
        const { code, message, details } = await updateProject(req.params.id, req.body);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Deletes a project based on the provided project ID.
 *
 * @param req - The request object containing the project ID in the parameters.
 * @param resp - The response object used to send the status and result back to the client.
 *
 * @returns A JSON response with the status code, message, and details if successful,
 *          or an error message if an exception occurs.
 *
 * @throws Will return a 500 status code and error message if an exception occurs during deletion.
 */
export const deleteProject = async (req: Request, resp: Response) => {
    try {
        const { code, message, details } = await deleteProjectFromStorage(req.params.id);
        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}
