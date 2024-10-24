import { Router } from "express";
import { createProjectSchema } from "../middleware/validators/project.validators";
import { asyncHandler } from "../utils";
import {
    create,
    getProjects,
    getProjectById,
    getProjectsByTeamId,
    update,
    deleteProject
} from "../controllers/project.controller";

const projectRouter = Router();

projectRouter.get('/', asyncHandler(getProjects));
projectRouter.get('/:id', asyncHandler(getProjectById));
projectRouter.get('/', asyncHandler(getProjectsByTeamId));
projectRouter.post('/', createProjectSchema, asyncHandler(create));
projectRouter.put('/:id', asyncHandler(update));
projectRouter.delete('/:id', asyncHandler(deleteProject));

export default projectRouter
