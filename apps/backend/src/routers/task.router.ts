import { Router } from "express";
import { createTaskSchema } from "../middleware/validators/task.validators";
import { asyncHandler } from "../utils";
import { create, getTasks, getTaskById } from "../controllers/task.controller";

const taskRouter = Router();

taskRouter.post('/', createTaskSchema, asyncHandler(create));
taskRouter.get('/', asyncHandler(getTasks));
taskRouter.get('/:id', asyncHandler(getTaskById));

export default taskRouter;
