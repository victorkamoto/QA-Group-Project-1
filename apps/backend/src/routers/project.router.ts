import { Router } from "express";
import { createProjectSchema } from "../middleware/validators/project.validators";
import { asyncHandler } from "../utils";
import { create, getProjects, getProjectById } from "../controllers/project.controller";

const projectRouter = Router();

projectRouter.post('/', createProjectSchema, asyncHandler(create));
projectRouter.get('/', asyncHandler(getProjects));
projectRouter.get('/:id', asyncHandler(getProjectById));

export default projectRouter