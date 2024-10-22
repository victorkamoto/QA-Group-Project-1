import { xata } from "../server";
import { NewProject } from "../types/project.types";

/**
 * Creates a new project.
 *
 * @param {NewProject} project - The project details.
 * @param {string} project.name - The name of the project.
 * @param {string} project.teamId - The ID of the team to which the project belongs.
 * 
 * @returns {Promise<{code: number, message: string, details: any}>} - The result of the project creation.
 * 
 * @throws {Error} - If there is an error during project creation.
 * 
 * @example
 * const newProject = { name: 'Project Alpha', teamId: 'team123' };
 * const result = await createProject(newProject);
 * console.log(result);
 */
export const createProject = async (project: NewProject) => {
    const { name, teamId } = project;

    try {
        // check if team with teamId exists
        const team = await xata.db.Team.filter({ xata_id: teamId }).getFirst();

        if (!team) {
            return {
                code: 400,
                message: 'Error creating project!',
                details: 'Invalid teamId'
            }
        }
        // check if project already exists
        const existingProject = await xata.db.Project.filter({ name: name.toString(), teamId: team.xata_id }).getFirst();

        if (existingProject) {
            return {
                code: 400,
                message: 'Error creating project!',
                details: 'Project already exists!'
            }
        }

        const result = await xata.db.Project.create({ name: name.toLowerCase(), teamId });

        return {
            code: 201,
            message: 'Project created successfully!',
            details: result
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error creating project!',
            details: error.toString()
        }
    }
}

/**
 * Fetches all projects from the database.
 *
 * @returns {Promise<any>} A promise that resolves to the list of projects or an error message.
 * @throws {Error} If there is an issue fetching the projects from the database.
 */
export const fetchProjects = async () => {
    try {
        const projects = await xata.db.Project.getAll();

        return projects;
    } catch (error: any) {
        return error.toString();
    }
}

/**
 * Fetches a project by its ID.
 *
 * @param teamId - The ID of the team whose project is to be fetched.
 * @returns A promise that resolves to an object containing the status code, message, and project details if found, or an error message if not found or if an error occurs.
 *
 * @example
 * ```typescript
 * const result = await fetchProjectById('team123');
 * if (result.code === 200) {
 *     console.log(result.message, result.details);
 * } else {
 *     console.error(result.message, result.details);
 * }
 * ```
 */
export const fetchProjectById = async (teamId: string) => {
    try {
        const project = await xata.db.Project.filter({ xata_id: teamId }).getFirst();

        if (project) {
            return {
                code: 200,
                message: 'Project found!',
                details: project
            }
        }

        return {
            code: 404,
            message: 'Project not found!',
            details: `Project with id ${teamId} not found!`
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error fetching project!',
            details: error.toString()
        }
    }
}
