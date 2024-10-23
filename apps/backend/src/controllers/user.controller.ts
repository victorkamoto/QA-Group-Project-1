import { Request, Response } from "express";
import { fetchUsers, fethUserById, updateUser, deleteUserFromStorage } from "../services/user.services";
import { createUser } from "../services/user.services";

export const create = async (req: Request, resp: Response) => {
    try {
        const { code, message, details } = await createUser(req.body);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves a list of users.
 *
 * @param req - The request object.
 * @param resp - The response object.
 * @returns A promise that resolves to a JSON response containing the list of users.
 * @throws Will return a 500 status code and an error message if fetching users fails.
 */
export const getUsers = async (req: Request, resp: Response) => {
    try {
        const users = await fetchUsers();

        resp.json(users);

    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

/**
 * Retrieves a user by their ID.
 *
 * @param req - The request object containing the user ID in the parameters.
 * @param resp - The response object used to send the response back to the client.
 * @returns A JSON response with the user details or an error message.
 *
 * @throws Will return a 500 status code with an "Internal server error" message if an error occurs.
 */
export const getUserById = async (req: Request, resp: Response) => {
    try {
        const { code, message, details } = await fethUserById(req.params.id);

        resp.status(code).json({ message, details });
    } catch (error) {
        resp.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Updates a user with the given ID using the data provided in the request body.
 *
 * @param req - The request object containing the user ID in the params and the update data in the body.
 * @param resp - The response object used to send back the status and result of the update operation.
 *
 * @returns A promise that resolves to a response with the status code and a JSON object containing
 *          a message and details of the update operation, or an error message if the update fails.
 */
export const update = async (req: Request, resp: Response) => {
    try {
        const { code, message, details } = await updateUser(req.params.id, req.body);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}

export const deleteUser = async (req: Request, resp: Response) => {
    try {
        const { code, message, details } = await deleteUserFromStorage(req.params.id);

        resp.status(code).json({ message, details });
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}
