import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { XataClient } from "./xata";
import userRouter from "./routers/user.router";
import teamRouter from "./routers/team.router";
import projectRouter from "./routers/project.router";

dotenv.config();

// export const xata = getXataClient();
export const xata = new XataClient({
  apiKey: process.env.XATA_API_KEY,
  branch: process.env.XATA_BRANCH
})

const app: Express = express();
const port: string | number = process.env.PORT || 3500;

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req: Request, resp: Response) => {
  resp.json({ msg: "Hello" });
});

app.use("/users", userRouter);
app.use('/teams', teamRouter);
app.use('/projects', projectRouter)

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

export default app;
