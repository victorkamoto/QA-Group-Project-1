import { Router } from "express";
import { createProjectSchema } from "../middleware/validators/project.validators";
import { asyncHandler } from "../utils";
import { create, getProjects, getProjectById, update } from "../controllers/project.controller";

const projectRouter = Router();

projectRouter.get('/', asyncHandler(getProjects));
projectRouter.get('/:id', asyncHandler(getProjectById));
projectRouter.post('/', createProjectSchema, asyncHandler(create));
projectRouter.put('/:id', asyncHandler(update));

export default projectRouter
