export type User = {
    xata_id: string | number;
    name: string;
    email: string;
    password: string;
    role: 'member' | 'admin';
};

export type NewUser = Omit<User, 'xata_id'>;
export type LoginUser = Pick<User, 'email' | 'password'>
export type UpdateUser = Partial<Omit<User, 'xata_id'>>;
