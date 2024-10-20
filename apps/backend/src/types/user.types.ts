export type User = {
    id: string | number;
    name: string;
    email: string;
    password: string;
    role: 'member' | 'admin';
};

export type NewUser = Omit<User, 'id'>;
