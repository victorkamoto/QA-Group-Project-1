import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { JoinTeam, Team, RemoveMember } from "../types/team.types";
import {
    createTeam,
    fetchTeams,
    fetchTeamByid,
    updateTeam,
    joinUserToTeam,
    removeUserFromTeam,
    deleteTeamFromStorage
} from "../services/team.services";

/**
 * Creates a new team based on the request body.
 * 
 * @param req - The request object containing the team data.
 * @param resp - The response object used to send back the HTTP response.
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

        const { code, message, details } = await createTeam(req.body);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves a list of teams and sends them as a JSON response.
 *
 * @param req - The request object.
 * @param resp - The response object.
 * @returns A promise that resolves to sending the list of teams as a JSON response.
 *
 * @throws Will send a 500 status code and an error message if fetching teams fails.
 */
export const getTeams = async (req: Request, resp: Response) => {
    try {
        const teams = await fetchTeams();

        resp.json(teams);
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves a team by its ID.
 *
 * @param req - The request object containing the team ID in the parameters.
 * @param resp - The response object used to send the team data or an error message.
 * @returns A promise that resolves to the team data if found, or an error message if an error occurs.
 */
export const getTeamById = async (req: Request, resp: Response) => {
    const id: string = req.params.id;

    try {
        const { code, message, details } = await fetchTeamByid(id);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Updates a team with the given ID and request body.
 *
 * @param req - The request object containing the team ID in params and the team data in the body.
 * @param resp - The response object used to send back the HTTP response.
 *
 * @returns A promise that resolves to a JSON response with the status code, message, and details of the update operation.
 *
 * @throws Will return a 500 status code and an error message if the update operation fails.
 */
export const update = async (req: Request, resp: Response) => {
    const id: string = req.params.id;
    const body: Team = req.body;

    try {
        const { code, message, details } = await updateTeam(id, body);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Adds a member to a team.
 *
 * @param req - The request object containing the body with user and team information.
 * @param resp - The response object used to send back the HTTP response.
 *
 * @remarks
 * This function extracts the userId and teamId from the request body and attempts to join the user to the specified team.
 * If successful, it sends back a response with the status code, message, and details.
 * If an error occurs, it catches the error and sends back a 500 status code with the error message.
 *
 * @throws Will throw an error if the joinUserToTeam function fails.
 */
export const addMember = async (req: Request, resp: Response) => {
    const data: JoinTeam = req.body;

    try {
        const { userId, teamId } = data;
        const { code, message, details } = await joinUserToTeam(userId, teamId);

        resp.status(code).json({ message, details });

    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Removes a member from a team.
 *
 * @param req - The request object containing the member removal data.
 * @param resp - The response object to send the result of the operation.
 *
 * @remarks
 * The function expects the request body to contain the `userId` and `teamId` of the member to be removed.
 * It calls the `removeUserFromTeam` function to perform the removal and sends the appropriate response.
 *
 * @throws Will send a 500 status code with an error message if an exception occurs.
 */
export const removeMember = async (req: Request, resp: Response) => {
    const data: RemoveMember = req.body;

    try {
        const { userId, teamId } = data;
        const { code, message, details } = await removeUserFromTeam(userId, teamId);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

export const deleteTeam = async (req: Request, resp: Response) => {
    try {
        const id: string = req.params.id;
        const { code, message, details } = await deleteTeamFromStorage(id);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

