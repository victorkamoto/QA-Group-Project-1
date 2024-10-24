import { Request, Response } from "express";
import { fetchAllTeamMembers, fetchTeamMemberById } from "../services/teamMember.services";


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


/**
 * Retrieves a team member by their ID.
 *
 * @param req - The request object containing the team member ID in the query parameters.
 * @param res - The response object used to send back the HTTP response.
 * @returns A promise that resolves to an HTTP response containing the team member details or an error message.
 *
 * @throws Will return a 400 status code if the `memberId` query parameter is missing.
 * @throws Will return a 500 status code if an unexpected error occurs during the process.
 */
export const getTeamMemberById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const teamMemberId = req.query.memberId?.toString();

        if (!teamMemberId) {
            return res.status(400).json({ message: 'memberId is required!' });
        }

        const { code, message, details } = await fetchTeamMemberById(teamMemberId);

        return res.status(code).json({ message, details });
    } catch (error: any) {
        return res.status(500).json({ error: error.toString() });
    }
}
