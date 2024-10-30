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

/**
 * Fetches a team member by their User ID from the database.
 *
 * @param id - The unique identifier of the team member.
 * @returns An object containing the status code, message, and details.
 * - If the team member is found, returns a 200 status code with the team member details.
 * - If the team member is not found, returns a 404 status code with a not found message.
 * - If an error occurs, returns a 500 status code with the error message.
 */
export const fetchTeamMemberById = async (id: string) => {
    try {
        const teamMember = await xata.db.TeamMember.filter({ userId: id }).getAll();

        if (!teamMember) {
            return {
                code: 404,
                message: 'Team member not found!',
                details: `Team member with id ${id} not found!`
            }
        }

        return {
            code: 200,
            message: 'Team member found!',
            details: teamMember
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error fetching team member!',
            details: error.toString()
        }
    }
}

/**
 * Fetches team members by the given team ID.
 *
 * @param {string} teamId - The ID of the team to fetch members for.
 * @returns {Promise<{code: number, message: string, details: any}>} - A promise that resolves to an object containing the status code, message, and details of the operation.
 *
 * @throws {Error} - Throws an error if there is an issue fetching the team members.
 */
export const fetchTeamMembersByTeamId = async (teamId: string) => {
    try {
        const teamMembers = await xata.db.TeamMember.select(["*", "teamId.*", "userId.*"]).filter({ teamId }).getAll();

        if (teamMembers.length === 0) {
            return {
                code: 400,
                message: 'Error fetching team member data!',
                details: `Team with id ${teamId} does not exists!`
            }
        }

        return {
            code: 200,
            message: 'Team members fetched successfully!',
            details: teamMembers
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error fetching team member data!',
            details: error.toString()
        }
    }
}
