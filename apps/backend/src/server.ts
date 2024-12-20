import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import { XataClient } from "./xata";

// import routers
import userRouter from "./routers/user.router";
import teamRouter from "./routers/team.router";
import projectRouter from "./routers/project.router";
import taskRouter from "./routers/task.router";
import commentsRouter from "./routers/comments.router";
import notificationRouter from "./routers/notifications.router";
import teamMemberRouter from "./routers/teamMember.router";

// import notification task to schedule
import { createNotificationsJob } from "./utils/notifications.schedular";

dotenv.config();

export const xata = new XataClient({
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH,
});

const app: Express = express();
const port: string | number = process.env.PORT || 3500;

createNotificationsJob.start();

app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));


app.use("/", userRouter);
app.use('/teams', teamRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);
app.use('/comments', commentsRouter);
app.use('/notifications', notificationRouter);
app.use('/teamMembers', teamMemberRouter);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

export default app;
