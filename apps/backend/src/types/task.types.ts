type Task = {
    xata_id: string;
    description: string;
    dueDate: Date;
    status: 'in-progress' | 'completed';
    projectId: string;
    assignedToId: string;
}

export type NewTask = Omit<Task, 'xata_id'>;
export type UpdateTask = Partial<Omit<Task, 'xata_id'>>;
type TaskStatus = Pick<Task, 'status'>;

export const isValidStatus = (status: string): boolean => {
    return ['in-progress', 'completed'].includes(status);
}
