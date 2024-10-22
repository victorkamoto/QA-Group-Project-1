import { xata } from "../server";
import { UpdateUser, NewUser } from "../types/user.types";
import bcrypt from 'bcryptjs';

/**
 * Fetches all users from the database.
 *
 * @returns {Promise<any>} A promise that resolves to the list of users or an error message.
 *
 * @throws {Error} If there is an issue fetching the users from the database.
 */
export const fetchUsers = async () => {
  try {
    const users = await xata.db.User.getAll();

    return users;
  } catch (error: any) {
    return error.toString();
  }
};

/**
 * Fetches a user by their ID from the database.
 *
 * @param userId - The ID of the user to fetch.
 * @returns A promise that resolves to an object containing the status code, message, and user details or error details.
 *
 * @example
 * ```typescript
 * const result = await fethUserById('12345');
 * if (result.code === 200) {
 *   console.log('User details:', result.details);
 * } else {
 *   console.error('Error:', result.message, result.details);
 * }
 * ```
 */
export const fethUserById = async (userId: string) => {
  try {
    const user = await xata.db.User.filter({ xata_id: userId }).getFirst();

    if (!user) {
      return {
        code: 404,
        message: 'Error fetching user!',
        details: `User with id ${userId} does not exist!`
      }
    }

    return {
      code: 200,
      message: 'User fetched successfully!',
      details: user
    }
  } catch (error: any) {
    return {
      code: 500,
      message: 'Error fetching user!',
      details: error.toString()
    }
  }
}

/**
 * Updates a user in the database.
 *
 * @param userId - The ID of the user to update.
 * @param body - The data to update the user with.
 * @returns An object containing the status code, message, and details of the update operation.
 *
 * @throws Will return a 500 status code and an error message if an internal server error occurs.
 */
export const updateUser = async (userId: string, body: UpdateUser) => {
  try {
    const existingUser = await xata.db.User.filter({ xata_id: userId }).getFirst();

    if (!existingUser) {
      return {
        code: 404,
        message: 'Error updating user!',
        details: `User with id ${userId} does not exist!`
      }
    }

    // update password
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      body.password = hashedPassword;
    }

    const result = await xata.db.User.update(userId, body);

    return {
      code: 200,
      message: 'Updated user succesfully!',
      details: result
    }
  } catch (error: any) {
    return {
      code: 500,
      message: 'Internal server error',
      details: error.toString()
    }
  }
}

/**
 * Deletes a user from the storage based on the provided user ID.
 *
 * @param {string} userId - The ID of the user to be deleted.
 * @returns {Promise<{code: number, message: string, details: any}>} - A promise that resolves to an object containing the status code, message, and details of the operation.
 *
 * @example
 * const response = await deleteUserFromStorage('user123');
 * if (response.code === 200) {
 *   console.log(response.message);
 * } else {
 *   console.error(response.message, response.details);
 * }
 *
 * @throws {Error} - Throws an error if there is an issue with the deletion process.
 */
export const deleteUserFromStorage = async (userId: string) => {
  try {
    const user = await xata.db.User.filter({ xata_id: userId }).getFirst();

    if (!user) {
      return {
        code: 404,
        message: 'Error deleting user!',
        details: `User with id ${userId} does not exists!`
      }
    }

    const result = await xata.db.User.delete(userId);

    return {
      code: 200,
      message: 'Deleted user successfully!',
      details: result
    }

  } catch (error: any) {
    return {
      code: 500,
      message: 'Internal server error',
      details: error.toString()
    }
  }
}

/**
 * Creates a new user in the system.
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
 * createUser(newUser).then(response => {
 *   console.log(response);
 * });
 */
export const createUser = async (user: NewUser) => {
  const { name, email, password, role } = user;

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
      role: role || 'member'
    });

    return {
      code: 201,
      message: "User created successfully!",
      details: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        id: newUser.xata_id
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

