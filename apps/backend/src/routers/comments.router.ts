import { Router } from "express";
import { asyncHandler } from "../utils";
import { createCommentSchema } from "../middleware/validators/comments.validators";
import {
    create,
    getComments,
    getCommentById,
    getCommentsByTaskId,
    getCommentsByUserId,
    deleteComment
} from "../controllers/comments.controller";

const commentsRouter = Router();

commentsRouter.post("/", createCommentSchema, asyncHandler(create));
commentsRouter.get("/", asyncHandler(getComments));
commentsRouter.get("/:id", asyncHandler(getCommentById));
commentsRouter.get("/task/:taskId", asyncHandler(getCommentsByTaskId));
commentsRouter.get("/user/:userId", asyncHandler(getCommentsByUserId));
commentsRouter.delete("/:id", asyncHandler(deleteComment));
export default commentsRouter;
