import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface CustomRequest extends Request {
    user?: any;
}
const authenticateTokenMiddleware = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.signedCookies["token-Cookie"];

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    //user is unauthorized
    if (!token || token === "null") {
        console.log(token)
        res.status(400).json({ message: "Unauthorized request" });
    } else if (!accessTokenSecret) {
        console.log("Access Token secret was missing in the env files");
        res.sendStatus(500);
    } else {
        try {
            let verifiedUser = jwt.verify(token, accessTokenSecret);
            req.user = verifiedUser;
            next();
        } catch (error) {
            res.status(403).json({ message: "Invalid or expired token" });
        }
    }
};
export { authenticateTokenMiddleware };
