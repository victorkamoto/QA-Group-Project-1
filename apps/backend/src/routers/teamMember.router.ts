import { Router } from "express";
import { asyncHandler } from "../utils";
import { getAllTeamMembers, getTeamMemberById } from "../controllers/teamMember.controller";

const teamMemberRouter = Router();

teamMemberRouter.get('/', asyncHandler(getAllTeamMembers));
teamMemberRouter.get('/', asyncHandler(getTeamMemberById));

export default teamMemberRouter;
