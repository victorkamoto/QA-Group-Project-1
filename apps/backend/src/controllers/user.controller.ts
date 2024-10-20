import { fetchUsers } from "../services/auth.services";
import { Request, Response } from "express";

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
