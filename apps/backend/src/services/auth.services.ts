import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { xata } from "../server";
import { NewUser, LoginUser } from "../types/user.types";
import { User } from "../xata";
import { response } from "express";

config();

/**
 * Registers a new user in the system.
 *
 * @param {NewUser} user - The user details to register.
 * @returns {Promise<{code: number, message: string, details?: {email: string, name: string} | string}>}
 *          A promise that resolves to an object containing the status code, message, and optionally user details or error details.
 *
 * @example
 * const newUser = {
 *   name: 'John Doe',
 *   email: 'john.doe@example.com',
 *   password: 'securePassword123'
 * };
 *
 * registerUser(newUser).then(response => {
 *   console.log(response);
 * });
 */
export const registerUser = async (user: NewUser) => {
  const { name, email, password } = user;

  try {
    const existingUser = await xata.db.User.filter({ email }).getFirst();

    if (existingUser) {
      return { code: 400, message: "User already exists!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await xata.db.User.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      code: 201,
      message: "User created successfully!",
      details: {
        email: newUser.email,
        name: newUser.name,
      },
    };
  } catch (error: any) {
    return {
      code: 500,
      message: "Registration error!",
      details: error.toString(),
    };
  }
};

/**
 * Authenticates a user by their email and password.
 *
 * @param {LoginUser} user - The user object containing email and password.
 * @returns {Promise<{ code: number, message?: string, token?: string, details?: string }>}
 *          - A promise that resolves to an object containing the status code,
 *            and either a message or a JWT token.
 *
 * @throws {Error} If JWT_SECRET or JWT_EXPIRE_IN is not defined in environment variables.
 */
export const loginUser = async (user: LoginUser) => {
  const { email, password } = user;

  try {
    console.log("Retrieving user from database...");
    const user: User | null = await xata.db.User.filter({ email }).getFirst();

    if (!user) {
      console.log("User not found");
      return { code: 400, message: "Invalid credentials!" };
    }

    console.log("User found, comparing passwords...");
    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password does not match");
      return { code: 400, message: "Invalid credentials!" };
    }

    console.log("Password matches, checking environment variables...");
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpireIn = process.env.JWT_EXPIRES_IN;

    if (!jwtSecret || !jwtExpireIn) {
      throw new Error(
        "JWT_SECRET or JWT_EXPIRES_IN is not defined in environment variables"
      );
    }

    const token = jwt.sign({ userId: user.xata_id }, jwtSecret, {
      expiresIn: jwtExpireIn,
    });
    console.log("Credentials match, token generated!");

    return { code: 200, token };
  } catch (error: any) {
    console.error("Error during login:", error);
    return {
      code: 500,
      message: `Login error: ${error.toString()}`,
    };
  }
};
