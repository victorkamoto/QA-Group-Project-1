import { CreateTeam } from "../types/team.types";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { createTeam } from "../services/team.services";

export const create = async (req: Request, resp: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return resp.status(400).json({ errors: errors.array() });
        }

        const { code, message, details } = await createTeam(req.body);

        resp.status(code).json({ message, details });
    } catch (error) {

    }
}
