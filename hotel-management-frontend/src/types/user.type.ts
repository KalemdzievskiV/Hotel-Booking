import { Hotel } from './hotel.type';

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    STAFF = 'STAFF',
    GUEST = 'GUEST'
}

export interface User {
    id?: number;
    firstName: string;
    lastName: string;
    username: string;
    password?: string;
    role: UserRole;
    email: string;
    phoneNumber: string;
    active: boolean;
    hotels?: Hotel[];
}
