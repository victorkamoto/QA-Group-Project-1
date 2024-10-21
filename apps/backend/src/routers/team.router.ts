import { createTeamSchema } from "../middleware/validators/team.validatior";
import { asyncHandler } from "../utils";
import { Router } from "express";
import {
    create,
    getTeams,
    getTeamById,
    update,
    addMember
} from "../controllers/team.controller";

const teamRouter = Router();

teamRouter.get('/', asyncHandler(getTeams));
teamRouter.get('/:id', asyncHandler(getTeamById));
teamRouter.post('/', createTeamSchema, asyncHandler(create));
teamRouter.put('/:id', asyncHandler(update));
teamRouter.post('/add', asyncHandler(addMember));

export default teamRouter;
