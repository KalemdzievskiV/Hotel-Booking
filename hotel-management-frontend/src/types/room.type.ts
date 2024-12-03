import { Hotel } from './hotel.type';
import { Reservation } from './reservation.type';

export enum RoomStatus {
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED',
    MAINTENANCE = 'MAINTENANCE'
}

export interface Room {
    id?: number;
    number: string;
    name: string;
    description?: string;
    status: RoomStatus;
    price: number;
    pictures: string[];
    hotel: Hotel;
    reservations?: Reservation[];
}
