export type Notification = {
    xata_id: string;
    userId: string;
    message: string;
    read: boolean;
}

export type NewNotification = Omit<Notification, 'xata_id'>;
