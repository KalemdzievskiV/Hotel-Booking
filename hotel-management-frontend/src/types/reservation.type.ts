import { Room } from './room.type';
import { Hotel } from './hotel.type';
import { User } from './user.type';

export enum ReservationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CHECKED_IN = 'CHECKED_IN',
    CHECKED_OUT = 'CHECKED_OUT',
    CANCELLED = 'CANCELLED'
}

// Type for creating a new reservation
export interface CreateReservationDTO {
    room: { id: number };
    hotel: { id: number };
    guest: { id: number };
    checkInTime: string;
    checkOutTime: string;
    totalPrice: number;
    specialRequests?: string;
    status: ReservationStatus;
}

export interface Reservation {
    id?: number;
    room: Room;
    hotel: Hotel;
    guest: User;
    checkInTime: string;
    checkOutTime: string;
    totalPrice: number;
    specialRequests?: string;
    status: ReservationStatus;
    createdAt: string;
}
