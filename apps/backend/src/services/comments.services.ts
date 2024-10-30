import { xata } from "../server";
import { CreateComment } from "../types/comments.type";

/**
 * Creates a new comment in the database.
 *
 * @param {CreateComment} comment - The comment data to be created.
 * @param {string} comment.content - The content of the comment.
 * @param {string} comment.taskId - The ID of the task associated with the comment.
 * @param {string} comment.userId - The ID of the user creating the comment.
 * 
 * @returns {Promise<{code: number, message: string, details: any}>} - The result of the comment creation operation.
 * 
 * @throws {Error} - Throws an error if there is an issue with the database operation.
 */
export const createComment = async (comment: CreateComment) => {
    try {
        const { content, taskId, userId } = comment;

        const user = xata.db.User.filter({ xata_id: userId }).getFirst()

        if (!user) {
            return {
                code: 404,
                message: 'Error creating comment!',
                details: `user with id ${userId} does not exists!`
            }
        }

        const task = xata.db.Task.filter({ xata_id: taskId }).getFirst();

        if (!task) {
            return {
                code: 404,
                message: 'Error creating comment!',
                details: `task with id ${taskId} does not exists!`
            }
        }

        const result = await xata.db.Comment.create({ content, userId, taskId });

        return {
            code: 201,
            message: 'Comment created successfully!',
            details: result
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Internal server error!',
            details: error.toString()
        }
    }
}

/**
 * Fetches all comments from the database.
 *
 * @returns {Promise<any>} A promise that resolves to the list of comments or an error message.
 *
 * @throws {Error} If there is an issue fetching the comments, the error is caught and its message is returned.
 */
export const fetchAllComments = async () => {
    try {
        const comments = xata.db.Comment.select(["*", "taskId.*", "userId.*", "taskId.projectId.*"]).getAll();

        return comments;
    } catch (error: any) {
        return error.toString();
    }
}

/**
 * Fetches comments associated with a specific task ID.
 *
 * @param {string} taskId - The ID of the task for which to fetch comments.
 * @returns {Promise<any>} A promise that resolves to the comments associated with the given task ID, or an error message if the operation fails.
 */
export const fetchCommentsByTaskId = async (taskId: string) => {
    try {
        const comments = xata.db.Comment.select(["*", "taskId.*", "userId.*", "taskId.projectId.*"]).filter({ taskId }).getAll();

        return comments;
    } catch (error: any) {
        return error.toString();
    }
}

/**
 * Fetches comments associated with a specific user ID.
 *
 * @param userId - The ID of the user whose comments are to be fetched.
 * @returns A promise that resolves to an array of comments or an error message.
 *
 * @throws Will return an error message if the fetch operation fails.
 */
export const fetchCommentsByUserId = async (userId: string) => {
    try {
        const comments = xata.db.Comment.select(["*", "taskId.*", "userId.*", "taskId.projectId.*"]).filter({ userId }).getAll();

        return comments;
    } catch (error: any) {
        return error.toString();
    }
}


/**
 * Fetches a comment by its ID from the database.
 *
 * @param id - The unique identifier of the comment to fetch.
 * @returns A promise that resolves to an object containing the status code, message, and details of the comment.
 *          If the comment is found, the details will contain the comment data.
 *          If the comment is not found, the details will contain an error message.
 *          If an error occurs during the fetch operation, the error message will be returned.
 */
export const fetchCommentById = async (id: string) => {
    try {
        const comment = xata.db.Comment.select(["*", "taskId.*", "userId.*", "taskId.projectId.*"]).filter({ xata_id: id }).getFirst();

        if (!comment) {
            return {
                code: 404,
                message: 'Comment not found!',
                details: `Comment with id ${id} not found!`
            }
        }

        return {
            code: 200,
            message: 'Comment found!',
            details: comment
        }

    } catch (error: any) {
        return error.toString();
    }
}

/**
 * Deletes a comment from the database based on the provided ID.
 *
 * @param {string} id - The ID of the comment to be deleted.
 * @returns {Promise<{code: number, message: string, details: any}>} - A promise that resolves to an object containing the status code, message, and details of the operation.
 *
 * @throws {Error} - Throws an error if the deletion process fails.
 */
export const deleteCommentFromDatabase = async (id: string) => {
    try {
        const comment = xata.db.Comment.filter({ xata_id: id }).getFirst();

        if (!comment) {
            return {
                code: 404,
                message: 'Error deleting comment!',
                details: `comment with id ${id} does not exists!`
            }
        }

        const result = xata.db.Comment.delete({ xata_id: id });

        return {
            code: 200,
            message: 'Comment deleted successfully!',
            details: result
        };
    } catch (error: any) {
        return error.toString();
    }
}
