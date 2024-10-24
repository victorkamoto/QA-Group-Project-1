import { xata } from "../server";
import { CreateTeam, UpdateTeam } from "../types/team.types";

/**
 * Creates a new team in the database.
 *
 * @param {CreateTeam} team - The team details to be created.
 * @returns {Promise<{ code: number, message: string, details: string }>} - A promise that resolves to an object containing a status code, message and details.
 *
 * @throws {Error} - Throws an error if there is an issue with the database operation.
 *
 * @example
 * const team = { name: 'Developers', description: 'Development team' };
 * const result = await createTeam(team);
 * console.log(result); // { code: 201, message: 'Developers team created successfully!', details: [object Object] }
 */
export const createTeam = async (team: CreateTeam) => {
    const { name, description, adminId } = team;
    try {
        const existingTeam = await xata.db.Team.filter({ name: name.toLowerCase() }).getFirst();

        if (existingTeam) {
            return { code: 400, message: `Team ${name} already exists` };
        }

        const existingAdmin = await xata.db.User.filter({ xata_id: adminId }).getFirst();

        if (existingAdmin?.role !== 'admin') {
            return {
                code: 400,
                message: 'Unauthorized action',
                details: 'Only an admin can create a team'
            }
        }

        const newTeam = await xata.db.Team.create({ name, description, adminId });

        if (!newTeam) {
            return {
                code: 400,
                message: 'Error creating team',
                details: 'Could not create team'
            }
        }

        // join admin to TeamMember table
        const teamMember = await xata.db.TeamMember.create({
            teamId: newTeam.xata_id,
            userId: adminId,
            role: 'admin'
        });

        if (!teamMember) {
            return {
                code: 400,
                message: 'error adding admin to team',
                details: 'Could not add admin to team'
            }
        }
        return {
            code: 201,
            message: `${name} team created successfully!`,
            details: newTeam
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error creating team',
            details: error.toString()
        }
    }
}

/**
 * Fetches all teams from the database.
 *
 * @returns {Promise<any>} A promise that resolves to the list of teams or an error message.
 * @throws {Error} If there is an issue fetching the teams from the database.
 */
export const fetchTeams = async () => {
    try {
        const teams = await xata.db.Team.getAll();

        return teams;
    } catch (error: any) {
        return error.toString();
    }
}


/**
 * Fetches a team by its ID from the database.
 *
 * @param id - The unique identifier of the team.
 * @returns A promise that resolves to the team object if found, or an error message if an error occurs.
 */
export const fetchTeamByid = async (id: string) => {
    try {
        const team = await xata.db.Team.filter({ xata_id: id }).getFirst();

        if (!team) {
            return {
                code: 404,
                message: 'Team not found!',
                details: 'Team with id \`${id}\` not found!'
            }
        }

        return {
            code: 200,
            message: 'Team found!',
            details: team
        }
    } catch (error: any) {
        return error.toString();
    }
}

/**
 * Updates a team with the given ID using the provided body data.
 *
 * @param id - The unique identifier of the team to be updated.
 * @param body - The data to update the team with.
 * @returns An object containing the status code, message, and details of the operation.
 *
 * @throws Will return a 500 status code and error message if an internal server error occurs.
 */
export const updateTeam = async (id: string, body: UpdateTeam) => {
    try {
        const team = await xata.db.Team.filter({ xata_id: id }).getFirst();

        if (!team) {
            return {
                code: 404,
                message: `Team with id: ${id} cannot be found!`
            }
        }

        const result = await xata.db.Team.update(id, body);

        return {
            code: 200,
            message: 'Team updated successfully',
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
 * Joins a user to a team.
 *
 * @param userId - The ID of the user to join to the team.
 * @param teamId - The ID of the team to join the user to.
 * @returns An object containing the status code, message, and details of the operation.
 *
 * @example
 * ```typescript
 * const response = await joinUserToTeam('user123', 'team456');
 * if (response.code === 200) {
 *     console.log(response.message);
 * } else {
 *     console.error(response.message, response.details);
 * }
 * ```
 *
 * @throws Will return an error object if the operation fails.
 */
export const joinUserToTeam = async (userId: string, teamId: string) => {
    try {
        const user = await xata.db.User.filter({ xata_id: userId }).getFirst();

        if (!user) {
            return {
                code: 400,
                message: 'Error joining user',
                details: 'User not found'
            }
        }

        const team = await xata.db.Team.filter({ xata_id: teamId }).getFirst();

        if (!team) {
            return {
                code: 400,
                message: 'Error joining user',
                details: 'User not found'
            }
        }

        const teamMember = await xata.db.TeamMember.filter({ teamId, userId }).getFirst();

        if (teamMember) {
            return {
                code: 400,
                message: 'Error adding member',
                details: 'User is already a team member'
            }
        }

        const result = await xata.db.TeamMember.create({ teamId: teamId, userId: userId });

        return {
            code: 200,
            message: 'User joined to team successfully!',
            details: result
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error joining team',
            details: error.toString()
        }
    }
}

/**
 * Removes a user from a team.
 *
 * @param userId - The ID of the user to be removed.
 * @param teamId - The ID of the team from which the user will be removed.
 * @returns An object containing the status code, message, and details of the operation.
 *
 * @example
 * ```typescript
 * const response = await removeUserFromTeam('user123', 'team456');
 * console.log(response);
 * // {
 * //   code: 200,
 * //   message: 'Removed team member!',
 * //   details: { ... }
 * // }
 * ```
 *
 * @throws Will return an error object if the operation fails.
 */
export const removeUserFromTeam = async (userId: string, teamId: string) => {
    try {
        const teamMember = await xata.db.TeamMember.filter({ userId, teamId }).getFirst();

        if (!teamMember) {
            return {
                code: 400,
                message: 'Error removing user!',
                details: 'Team member record not found!'
            }
        }

        const result = await xata.db.TeamMember.delete(teamMember.xata_id);

        return {
            code: 200,
            message: 'Removed team member!',
            details: result
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error removing member!',
            details: error.toString()
        }
    }
}

/**
 * Deletes a team from the storage by its ID.
 *
 * @param {string} id - The ID of the team to be deleted.
 * @returns {Promise<{code: number, message: string, details: any}>} - A promise that resolves to an object containing the status code, message, and details of the operation.
 *
 * @example
 * const response = await deleteTeamFromStorage('team-id');
 * if (response.code === 200) {
 *     console.log(response.message); // 'Team deleted successfully'
 * } else {
 *     console.error(response.message); // 'Team not found' or 'Error deleting team'
 * }
 */
export const deleteTeamFromStorage = async (id: string) => {
    try {
        // check if team exists
        const team = await xata.db.Team.filter({ xata_id: id }).getFirst();

        if (!team) {
            return {
                code: 404,
                message: 'Team not found',
                details: 'Team does not exist'
            }
        }

        // delete team
        const result = await xata.db.Team.delete(id);

        return {
            code: 200,
            message: 'Team deleted successfully',
            details: result
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error deleting team',
            details: error.toString()
        }
    }
}
