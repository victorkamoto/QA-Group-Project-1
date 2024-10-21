import { Router } from "express";
import { asyncHandler } from "../utils";
import { createUserSchema } from "../middleware/validators/user.validators";
import { getUsers } from "../controllers/user.controller";
import { create, login } from "../controllers/auth.controller";
import { authenticateTokenMiddleware } from "../middleware/authToken.middleware";

const userRouter = Router();

userRouter.get('/', authenticateTokenMiddleware, asyncHandler(getUsers));
userRouter.post('/register', createUserSchema, asyncHandler(create));
userRouter.post('/login', asyncHandler(login));

export default userRouter;
