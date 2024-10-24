export interface Task {
    xata_id: string;
    description: string;
    dueDate: Date;
    status: 'in-progress' | 'completed' | string;
    projectId: string;
    assignedToId: string;
}

export type NewTask = Omit<Task, 'xata_id'>;
export type UpdateTask = Partial<Omit<Task, 'xata_id'>>;

export const isValidStatus = (status: string): status is Task['status'] => {
    return ['in-progress', 'completed'].includes(status);
}
