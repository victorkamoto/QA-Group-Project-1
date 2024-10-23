import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
    createComment,
    fetchAllComments,
    fetchCommentById,
    fetchCommentsByTaskId,
    fetchCommentsByUserId,
    deleteCommentFromDatabase
} from "../services/comments.services";
import exp from "constants";


/**
 * Creates a new comment.
 *
 * This function handles the creation of a new comment by validating the request,
 * calling the `createComment` service, and sending the appropriate response.
 *
 * @param req - The request object containing the comment data.
 * @param resp - The response object used to send the response.
 * @returns A JSON response with the status code, message, and details of the created comment,
 *          or an error message if the request is invalid or an error occurs.
 *
 * @throws {Error} If an unexpected error occurs during the comment creation process.
 */
export const create = async (req: Request, resp: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return resp.status(400).json({ errors: errors.array() });
        }

        const { code, message, details } = await createComment(req.body);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves all comments.
 *
 * This function fetches all comments from the database and sends them in the response.
 *
 * @param req - The request object.
 * @param resp - The response object.
 * @returns A promise that resolves to sending the comments in the response.
 *
 * @throws {Error} If an unexpected error occurs during the comment retrieval process.
 */
export const getComments = async (req: Request, resp: Response) => {
    try {
        const comments = await fetchAllComments();

        resp.json(comments);
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves a comment by its ID.
 *
 * This function fetches a comment by its ID from the database and sends it in the response.
 *
 * @param req - The request object containing the comment ID in the parameters.
 * @param resp - The response object used to send the status and JSON data.
 * @returns A promise that resolves to a JSON response containing the comment details or an error message.
 *
 * @throws {Error} If an unexpected error occurs during the comment retrieval process.
 */
export const getCommentById = async (req: Request, resp: Response) => {
    try {
        const { id } = req.params;
        const { code, message, details } = await fetchCommentById(id);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves comments associated with a specific task ID.
 *
 * @param req - The request object containing the task ID in the parameters.
 * @param resp - The response object used to send back the comments or an error message.
 * @returns A JSON response with the comments or an error message.
 *
 * @throws Will return a 500 status code and an error message if fetching comments fails.
 */
export const getCommentsByTaskId = async (req: Request, resp: Response) => {
    try {
        const { taskId } = req.params;
        const comments = await fetchCommentsByTaskId(taskId);

        resp.json(comments);
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves comments made by a specific user based on the user ID provided in the request parameters.
 * 
 * @param req - The request object containing the user ID in the parameters.
 * @param resp - The response object used to send back the retrieved comments or an error message.
 * 
 * @returns A JSON response containing the comments made by the user or an error message if the operation fails.
 */
export const getCommentsByUserId = async (req: Request, resp: Response) => {
    try {
        const { userId } = req.params;
        const comments = await fetchCommentsByUserId(userId);

        resp.json(comments);
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Deletes a comment from the database based on the provided comment ID.
 *
 * @param req - The request object containing the comment ID in the parameters.
 * @param resp - The response object used to send back the status of the delete operation.
 *
 * @returns A JSON response containing the status of the delete operation.
 */
export const deleteComment = async (req: Request, resp: Response) => {
    try {
        const { id } = req.params;
        const { code, message, details } = await deleteCommentFromDatabase(id);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}
