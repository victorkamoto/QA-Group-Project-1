import { xata } from "../server";

/**
 * Fetches all users from the database.
 *
 * @returns {Promise<any>} A promise that resolves to the list of users or an error message.
 *
 * @throws {Error} If there is an issue fetching the users from the database.
 */
export const fetchUsers = async () => {
  try {
    const users = xata.db.User.getAll();

    return users;
  } catch (error: any) {
    return error.toString();
  }
};
