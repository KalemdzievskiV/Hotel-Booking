import { Hotel } from './hotel.type';
import { Reservation } from './reservation.type';

export enum RoomStatus {
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED',
    MAINTENANCE = 'MAINTENANCE'
}

export enum RoomType {
    STANDARD = 'STANDARD',
    DELUXE = 'DELUXE',
    SUITE = 'SUITE',
    EXECUTIVE = 'EXECUTIVE'
}

export interface Room {
    id?: number;
    number: string;
    name: string;
    description?: string;
    status: RoomStatus;
    type: RoomType;
    price: number;
    pictures: string[];
    hotel: Hotel;
    reservations?: Reservation[];
}
