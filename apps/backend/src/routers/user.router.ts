import { Router } from "express";
import { asyncHandler } from "../utils";
import { getUsers } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get('/', asyncHandler(getUsers));

export default userRouter;
