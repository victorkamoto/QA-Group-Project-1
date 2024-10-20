import express, { Express, Request, Response } from "express";
import { XataClient } from "./xata";
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3500;
const xata: XataClient = new XataClient({
    apiKey: process.env.XATA_API_KEY,
    branch: process.env.XATA_BRANCH
});

app.get('/', (req: Request, resp: Response) => {
    resp.json({ msg: 'Hello' })
});

app.get('/users', async (req: Request, resp: Response) => {
    const users = await xata.db.User.getAll();

    resp.json({ users });
})

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});
