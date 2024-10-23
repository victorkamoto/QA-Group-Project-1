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

const convertXataRecordToTask = (record: TaskRecord): Task => {
  return {
    xata_id: record.xata_id,
    description: record.description ?? '',
    dueDate: new Date(record.dueDate ?? ''),
    status: record.status,
    projectId: record.projectId?.toString() ?? '',
    assignedToId: record.assignedToId?.toString() ?? ''
  };
};

type TaskKey = keyof Task;

export function getTaskDifferences(task1: TaskRecord, task2: TaskRecord): Partial<Task> {
  const differences: Partial<Task> = {};
  
  const originalTask = convertXataRecordToTask(task1);
  const updatedTask = convertXataRecordToTask(task2);

  (Object.keys(updatedTask) as TaskKey[]).forEach(key => {
    switch(key) {
      case 'dueDate':
        if (originalTask.dueDate.getTime() !== updatedTask.dueDate.getTime()) {
          differences.dueDate = updatedTask.dueDate;
        }
        break;
        
      case 'status':
        if (originalTask.status !== updatedTask.status) {
          differences.status = updatedTask.status;
        }
        break;
        
      case 'xata_id':
      case 'description':
      case 'projectId':
      case 'assignedToId':
        if (originalTask[key] !== updatedTask[key]) {
          differences[key] = updatedTask[key];
        }
        break;
    }
  });

  return differences;
}
