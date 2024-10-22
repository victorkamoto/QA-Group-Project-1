import { Router } from "express";
import { asyncHandler } from "../utils";
import { createUserSchema } from "../middleware/validators/user.validators";
import { authenticateTokenMiddleware } from "../middleware/authToken.middleware";
import { register, login } from "../controllers/auth.controller";
import { create, getUsers, getUserById, update, deleteUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.post('/auth/register', createUserSchema, asyncHandler(register));
userRouter.post('/auth/login', asyncHandler(login));

userRouter.post('/users/', createUserSchema, asyncHandler(create));
userRouter.get('/users', authenticateTokenMiddleware, asyncHandler(getUsers));
userRouter.get('/users/:id', asyncHandler(getUserById));
userRouter.put('/users/:id', asyncHandler(update));
userRouter.delete('/users/:id', asyncHandler(deleteUser));

export default userRouter;
