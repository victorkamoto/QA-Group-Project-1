type Comment = {
    xata_id: string;
    content: string;
    userId: string;
    taskId: string;
}

export type CreateComment = Omit<Comment, 'xata_id'>;
