import { Request, Response } from "express";
import { fetchAllTeamMembers } from "../services/teamMember.services";


/**
 * Retrieves all team members.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise that resolves to a response containing the status code, message, and details of the team members.
 *
 * @throws Will return a 500 status code and an error message if an error occurs during the fetch operation.
 */
export const getAllTeamMembers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { code, message, details } = await fetchAllTeamMembers();

        return res.status(code).json({ message, details });
    } catch (error: any) {
        return res.status(500).json({ error: error.toString() });
    }
}
