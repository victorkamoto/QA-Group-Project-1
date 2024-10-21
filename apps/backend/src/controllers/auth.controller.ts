import { registerUser, loginUser } from "../services/auth.services";
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

/**
 * Handles the login request.
 *
 * @param req - The request object containing user credentials.
 * @param resp - The response object to send the result of the login attempt.
 * @returns A JSON response with the result of the login attempt.
 *
 * If there are validation errors in the request, it responds with a 400 status and the errors.
 * If the login attempt is successful, it responds with the appropriate status code and message.
 * If an error occurs during the login process, it responds with a 500 status and the error message.
 */
export const login = async (req: Request, resp: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array() });
    }

    try {
        const result = await loginUser(req.body);

        if (result.code === 200) {
            resp.cookie('token-Cookie', result.token, {
                maxAge: 15 * 60 * 1000,
                httpOnly: true,
                signed: true
            });
            resp.status(result.code).json({ token: result.token });
        } else {
            resp.status(result.code).json({ message: result.message });
        }
    } catch (error: any) {
        resp.status(500).json({ error: error.toString() });
    }
}
