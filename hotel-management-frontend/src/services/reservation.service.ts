import { api } from './api.config';
import { Reservation, CreateReservationDTO } from '../types/reservation.type';

export class ReservationService {
    private static readonly BASE_PATH = '/reservations';

    static async createReservation(reservation: CreateReservationDTO): Promise<Reservation> {
        const response = await api.post(this.BASE_PATH, reservation);
        return response.data;
    }

    static async updateReservation(id: number, reservation: Reservation): Promise<Reservation> {
        const response = await api.put(`${this.BASE_PATH}/${id}`, reservation);
        return response.data;
    }

    static async getReservation(id: number): Promise<Reservation> {
        const response = await api.get(`${this.BASE_PATH}/${id}`);
        return response.data;
    }

    static async getAllReservations(): Promise<Reservation[]> {
        const response = await api.get(this.BASE_PATH);
        return response.data;
    }

    static async getReservationsByGuest(guestId: number): Promise<Reservation[]> {
        const response = await api.get(`${this.BASE_PATH}/guest/${guestId}`);
        return response.data;
    }

    static async getReservationsByHotel(hotelId: number): Promise<Reservation[]> {
        const response = await api.get(`${this.BASE_PATH}/hotel/${hotelId}`);
        return response.data;
    }

    static async getUpcomingReservations(guestId: number): Promise<Reservation[]> {
        const response = await api.get(`${this.BASE_PATH}/guest/${guestId}/upcoming`);
        return response.data;
    }

    static async getCurrentReservations(guestId: number): Promise<Reservation[]> {
        const response = await api.get(`${this.BASE_PATH}/guest/${guestId}/current`);
        return response.data;
    }

    static async cancelReservation(id: number): Promise<void> {
        await api.post(`${this.BASE_PATH}/${id}/cancel`);
    }
}
