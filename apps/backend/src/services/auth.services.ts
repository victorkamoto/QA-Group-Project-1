import bcrypt from 'bcryptjs';
import { xata } from '../utils'
import { NewUser } from '../types/user.types';

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
            return { code: 400, message: 'User already exists!' }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await xata.db.User.create({
            name, email,
            password: hashedPassword
        });

        return {
            code: 201,
            message: 'User created successfully!',
            details: {
                email: newUser.email,
                name: newUser.name
            }
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Registration error!',
            details: error.toString()
        }
    }
}

