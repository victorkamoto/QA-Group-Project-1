import { xata } from "../server";
import { CreateTeam } from "../types/team.types";

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
