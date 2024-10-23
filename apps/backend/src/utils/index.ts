import { Request, Response, NextFunction } from "express";
import { Task, isValidStatus } from "../types/task.types";
import { TaskRecord } from "../xata";

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

const convertXataRecordToTask = (record: TaskRecord) => {
  return {
    xata_id: record.xata_id,
    description: record.description,
    dueDate: new Date(record.dueDate),
    status: record.status as "in-progress" | "completed",
    projectId: record.projectId,
    assignedToId: record.assignedToId
  }
}



export function getTaskDifferences(task1: TaskRecord, task2: TaskRecord): Partial<Task> {
  const differences: Partial<Task> = {};

  const originalTask = convertXataRecordToTask(task1);
  const updatedTask = convertXataRecordToTask(task2);

  // Loop through each key in the updatedTask
  (Object.keys(updatedTask) as Array<keyof Task>).forEach(key => {
    if (key === 'dueDate') {
      // Handle Date comparison
      if (originalTask[key].getTime() !== updatedTask[key].getTime()) {
        differences[key] = updatedTask[key];
      }
    } else if (key === 'status') {
      // Handle status comparison
      if (originalTask[key] !== updatedTask[key]) {
        differences[key] = updatedTask[key];
      }
    } else {
      // Handle other string comparisons
      if (originalTask[key] !== updatedTask[key]) {
        differences[key] = updatedTask[key];
      }
    }
  });

  return differences;
}
