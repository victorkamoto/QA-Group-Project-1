import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { createTeam, fetchTeams, fetchTeamByid, updateTeam } from "../services/team.services";
import { Team } from "../types/team.types";

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
        const team = await fetchTeamByid(id);

        resp.json(team);
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
