import { XataClient } from "../xata";
import dotenv from 'dotenv';

dotenv.config();

export const xata: XataClient = new XataClient({
    apiKey: process.env.XATA_API_KEY,
    branch: process.env.XATA_BRANCH
})
