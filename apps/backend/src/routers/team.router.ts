import { create, getTeams, getTeamById } from "../controllers/team.controller";
import { createTeamSchema } from "../middleware/validators/team.validatior";
import { asyncHandler } from "../utils";
import { Router } from "express";

const teamRouter = Router();

teamRouter.post('/', createTeamSchema, asyncHandler(create));
teamRouter.get('/', asyncHandler(getTeams));
teamRouter.get('/:id', asyncHandler(getTeamById));

export default teamRouter;
