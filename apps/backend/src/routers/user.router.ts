import { Router } from "express";
import { asyncHandler } from "../utils";
import { createUserSchema } from "../middleware/validators/user.validators";
import { getUsers } from "../controllers/user.controller";
import { create } from "../controllers/auth.controller";

const userRouter = Router();

userRouter.get('/', asyncHandler(getUsers));
userRouter.post('/', asyncHandler(create));

export default userRouter;
