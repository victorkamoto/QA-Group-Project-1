import { xata } from "../server";

/**
 * Fetches all team members from the database.
 *
 * @returns {Promise<{code: number, message: string, details: any}>} 
 * An object containing the status code, message, and details.
 * - If team members are found, returns a 200 status code with the team members.
 * - If no team members are found, returns a 404 status code with a not found message.
 * - If an error occurs, returns a 500 status code with the error message.
 */
export const fetchAllTeamMembers = async () => {
    try {
        const teamMembers = await xata.db.TeamMember.getAll();

        if (teamMembers.length === 0) {
            return {
                code: 404,
                message: 'Team members not found!',
                details: 'No team members found!'
            }
        }

        return {
            code: 200,
            message: 'Team members found!',
            details: teamMembers
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error fetching team members!',
            details: error.toString()
        }
    }
}

