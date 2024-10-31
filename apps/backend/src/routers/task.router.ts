import { Router } from "express";
import { createTaskSchema } from "../middleware/validators/task.validators";
import { asyncHandler } from "../utils";
import {
    create,
    getTasks,
    getTaskById,
    update,
    deleteTask,
    updateStatus,
    getTasksByUserId
} from "../controllers/task.controller";

const taskRouter = Router();

taskRouter.post('/', createTaskSchema, asyncHandler(create));
taskRouter.get('/', asyncHandler(getTasks));
taskRouter.get('/:id', asyncHandler(getTaskById));
taskRouter.get('/user/:id', asyncHandler(getTasksByUserId));
taskRouter.put('/:id', asyncHandler(update));
taskRouter.patch('/:id', asyncHandler(updateStatus));
taskRouter.delete('/:id', asyncHandler(deleteTask));

export default taskRouter;
