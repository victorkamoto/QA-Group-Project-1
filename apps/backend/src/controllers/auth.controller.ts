import { registerUser } from "../services/auth.services";
import { Request, Response } from "express";
import { validationResult } from "express-validator";


/**
 * Handles the creation of a new user.
 * 
 * This function validates the incoming request, and if valid, attempts to register a new user.
 * If the request is invalid, it responds with a 400 status code and the validation errors.
 * If the registration is successful, it responds with the appropriate status code, message, and details.
 * If an error occurs during the process, it responds with a 500 status code and the error message.
 * 
 * @param req - The request object containing the user data.
 * @param resp - The response object used to send back the appropriate HTTP response.
 * 
 * @returns A promise that resolves to the HTTP response.
 */
export const create = async (req: Request, resp: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return resp.status(400).json({ errors: errors.array() });
        }

        const { code, message, details } = await registerUser(req.body);

        resp.status(code).json({ message, details });

    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}
