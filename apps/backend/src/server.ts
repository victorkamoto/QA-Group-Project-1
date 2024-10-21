import express, { Express, Request, Response } from "express";
import userRouter from "./routers/user.router";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { getXataClient } from "./xata";

dotenv.config();

export const xata = getXataClient();

const app: Express = express();
const port: string | number = process.env.PORT || 3500;

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req: Request, resp: Response) => {
  resp.json({ msg: "Hello" });
});

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});

export default app;