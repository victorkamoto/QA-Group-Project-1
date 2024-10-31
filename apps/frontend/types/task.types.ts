import { Project } from "./project.types";
import { User } from "./user.types";

export interface Task {
  xata_id: string;
  description: string;
  dueDate: string;
  status: "in-progress" | "completed" | "backlog" | "review" | string;
  projectId: Project;
  assignedToId: User;
}

export type CreateTask = Omit<Task, "xata_id">;
export type UpdateTask = Partial<Omit<Task, "xata_id">>;

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}
