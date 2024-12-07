import { ReservationStatus } from './reservation.type';

export interface CreateReservationDTO {
    roomId: string;
    userId: string;
    startTime: string;
    endTime: string;
    specialRequests?: string;
    totalPrice: number;
    status: ReservationStatus;
    hotelId: string;
}
