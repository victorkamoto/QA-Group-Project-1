import { xata } from "../server";
import { NewTask, UpdateTask, isValidStatus } from "../types/task.types";

export const createTask = async (task: NewTask) => {
    const { description, status, dueDate, projectId, assignedToId } = task;

    try {
        // check if project exists
        const project = xata.db.Project.filter({ xata_id: projectId }).getFirst();

        if (!project) {
            return {
                code: 404,
                message: 'Error creating Task',
                details: `Project with id ${projectId} does not exist!`
            }
        }

        // check if user to assign to exists
        const user = xata.db.User.filter({ xata_id: assignedToId }).getFirst();

        if (!user) {
            return {
                code: 404,
                message: 'Error creating Task',
                details: `User with id ${assignedToId} does not exist!`
            }
        }

        // validate status
        if (!isValidStatus(status)) {
            return {
                code: 400,
                message: 'Invalid status!',
                details: `status must be 'in-progress' or 'completed'!`
            }
        }

        const existingTask = await xata.db.Task.filter({ description: description.toLowerCase() }).getFirst();

        if (existingTask) {
            return {
                code: 409,
                message: 'Error creating Task',
                details: 'Tasks already exists.'
            }
        }

        const parsedDueDate = new Date(dueDate);

        const result = await xata.db.Task.create({
            description: description.toLowerCase(),
            status: status.toLowerCase(),
            dueDate: parsedDueDate.toISOString(),
            projectId, assignedToId
        });

        return {
            code: 201,
            message: 'Task created successfully',
            details: result
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Internal server error',
            details: error.toString()
        }
    }
}
