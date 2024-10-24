import { Router } from "express";
import { asyncHandler } from "../utils";
import { getAllTeamMembers } from "../controllers/teamMember.controller";

const teamMemberRouter = Router();

teamMemberRouter.get('/', asyncHandler(getAllTeamMembers));

export default teamMemberRouter;
