import * as z from "zod";

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const userSignupSchema = z.object({
  email: z.string().email(),
  // phone: z.string().min(10).max(15),
  password: z.string().min(8).max(100),
  name: z.string().refine(
    (value) => {
      // The value should be a string with two words separated by a space.
      const words = value.trim().split(" ");
      if (words.length !== 2) {
        return false;
      }

      // Each word should start with a capital letter.
      for (const word of words) {
        if (!/^[A-Z][a-z]*$/.test(word)) {
          return false;
        }
      }

      return true;
    },
    {
      message: "Input should be two names, e.g John Doe",
    },
  ),
});
