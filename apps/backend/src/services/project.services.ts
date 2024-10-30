import { xata } from "../server";
import { NewProject, UpdateProject } from "../types/project.types";

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
        const projects = await xata.db.Project.select(["*", "teamId.*", "teamId.adminId.*"]).getAll();

        if (projects.length === 0) {
            return {
                code: 404,
                message: 'Projects not found!',
                details: 'No projects found!'
            }
        }

        return {
            code: 200,
            message: 'Projects found!',
            details: projects
        };
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error fetching projects!',
            details: error.toString()
        }
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
        const project = await xata.db.Project.select(["*", "teamId.*", "teamId.adminId.*"]).filter({ xata_id: teamId }).getFirst();

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

/**
 * Fetches projects associated with a specific team ID.
 *
 * @param teamId - The ID of the team whose projects are to be fetched.
 * @returns An object containing the status code, message, and details.
 *          If projects are found, the details will contain the projects.
 *          If no projects are found, the details will contain a message indicating so.
 *          If an error occurs, the details will contain the error message.
 */
export const fetchProjectsByTeamId = async (teamId: string) => {
    try {
        const projects = await xata.db.Project.select(["*", "teamId.*"]).filter({ teamId }).getAll();

        if (projects.length === 0) {
            return {
                code: 404,
                message: 'Projects not found!',
                details: `No projects found for team with id ${teamId}`
            }
        }

        return {
            code: 200,
            message: 'Projects found!',
            details: projects
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error fetching projects!',
            details: error.toString()
        }
    }
}

/**
 * Updates a project with the given project ID and update data.
 *
 * @param {string} projectId - The ID of the project to update.
 * @param {UpdateProject} body - The data to update the project with.
 * @returns {Promise<{code: number, message: string, details: any}>} - A promise that resolves to an object containing the status code, message, and details of the update operation.
 *
 * @throws {Error} - If an error occurs during the update process.
 *
 * @example
 * const updateData = {
 *   name: "New Project Name",
 *   teamId: "team123",
 *   description: "Updated project description"
 * };
 * 
 * updateProject("project123", updateData)
 *   .then(response => {
 *     if (response.code === 200) {
 *       console.log("Project updated successfully:", response.details);
 *     } else {
 *       console.error("Failed to update project:", response.message);
 *     }
 *   })
 *   .catch(error => {
 *     console.error("Error updating project:", error);
 *   });
 */
export const updateProject = async (projectId: string, body: UpdateProject) => {
    try {
        const existsingProject = await xata.db.Project.filter({ xata_id: projectId });

        if (!existsingProject) {
            return {
                code: 404,
                message: 'Error updating project!',
                details: `Project with id '${projectId}' not found!`
            }
        }

        // check if team exists
        const team = await xata.db.Team.filter({ xata_id: body.teamId }).getFirst();

        if (!team) {
            return {
                code: 404,
                message: 'Error updating project!',
                details: `Team with id ${body.teamId} does not exist!`
            }
        }

        const result = await xata.db.Project.update(projectId, body);

        return {
            code: 200,
            message: 'Updated project successfully',
            details: result
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error updating project!',
            details: error.toString()
        }
    }
}

/**
 * Deletes a project from the storage by its ID.
 *
 * @param {string} projectId - The ID of the project to be deleted.
 * @returns {Promise<{ code: number, message: string, details: any }>} - A promise that resolves to an object containing the status code, message, and details of the operation.
 *
 * @example
 * const response = await deleteProjectFromStorage('project-id-123');
 * if (response.code === 200) {
 *     console.log(response.message); // Project deleted successfully
 * } else {
 *     console.error(response.message); // Error deleting project!
 * }
 */
export const deleteProjectFromStorage = async (projectId: string) => {
    try {
        const project = await xata.db.Project.filter({ xata_id: projectId }).getFirst();

        if (!project) {
            return {
                code: 404,
                message: 'Error deleting project!',
                details: `Project with id ${projectId} not found!`
            }
        }

        const result = await xata.db.Project.delete(projectId);

        return {
            code: 200,
            message: 'Project deleted succesfully',
            details: result
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Error deleting project!',
            details: error.toString()
        }
    }
}
