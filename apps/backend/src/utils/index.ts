import { Request, Response, NextFunction } from "express";

/**
 * A higher-order function that wraps an asynchronous route handler function
 * and ensures that any errors are passed to the next middleware.
 *
 * @param fn - The asynchronous route handler function to be wrapped.
 * @returns A new function that wraps the provided function and catches any errors,
 *          passing them to the next middleware.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
