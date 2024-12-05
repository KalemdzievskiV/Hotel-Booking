import { User } from "./user.type";

export interface Hotel {
    id?: number;
    name: string;
    address: string;
    description?: string;
    phoneNumber: string;
    email: string;
    starRating: number;
    amenities: string[];
    pictures: string[];
    averageRating: number;
    admin_id: number;  
}
