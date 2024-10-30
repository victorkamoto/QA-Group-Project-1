import { Router } from "express";
import { asyncHandler } from "../utils";
import { getAllTeamMembers, getTeamMembersByTeamID } from "../controllers/teamMember.controller";

const teamMemberRouter = Router();

teamMemberRouter.get('/', asyncHandler(getAllTeamMembers));
teamMemberRouter.get('/search', asyncHandler(getTeamMembersByTeamID));

export default teamMemberRouter;
