import { Router } from "express";
import { createTaskSchema } from "../middleware/validators/task.validators";
import { create, getTasks } from "../controllers/task.controller";
import { asyncHandler } from "../utils";

const taskRouter = Router();

taskRouter.post('/', createTaskSchema, asyncHandler(create));
taskRouter.get('/', asyncHandler(getTasks));

export default taskRouter;
