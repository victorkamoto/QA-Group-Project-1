import { Router } from "express";
import { createTaskSchema } from "../middleware/validators/task.validators";
import { create } from "../controllers/task.controller";
import { asyncHandler } from "../utils";

const taskRouter = Router();

taskRouter.post('/', createTaskSchema, asyncHandler(create));

export default taskRouter;
