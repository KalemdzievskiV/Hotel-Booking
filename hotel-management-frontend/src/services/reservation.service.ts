import { api } from './api.config';
import { Reservation, CreateReservationDTO, ReservationStatus } from '../types/reservation.type';

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

    static async updateReservationDTO(id: number, reservation: CreateReservationDTO): Promise<Reservation> {
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

    static async updateReservationStatus(id: number, status: ReservationStatus): Promise<Reservation> {
        try {
            console.log('Updating reservation status:', { id, status });
            const response = await api.patch(`${this.BASE_PATH}/${id}/status`, { status });
            const updatedReservation = response.data;
            console.log('Updated reservation:', updatedReservation);

            // Update the room status based on the new reservation status
            if (updatedReservation.room && updatedReservation.room.id) {
                console.log('Updating room status for room:', updatedReservation.room.id);
                await this.updateRoomStatusForReservation(updatedReservation.room.id, status);
            } else {
                console.warn('No room ID found in reservation:', updatedReservation);
            }

            return updatedReservation;
        } catch (error) {
            console.error('Error in updateReservationStatus:', error);
            throw error;
        }
    }

    private static async updateRoomStatusForReservation(roomId: number, reservationStatus: ReservationStatus): Promise<void> {
        try {
            console.log('Making room status update request:', {
                roomId,
                reservationStatus
            });
            // Remove /api prefix since it's already in the baseURL
            const response = await api.patch(`/rooms/${roomId}/status/by-reservation`, { 
                reservationStatus 
            });
            console.log('Room status update response:', response.data);
        } catch (error) {
            console.error('Error updating room status:', error);
            throw error;
        }
    }

    static async getHotelReservationStats(hotelId: number): Promise<{
        totalBookings: number;
        activeGuests: number;
        availableRooms: number;
        monthlyRevenue: number;
        recentBookings: Reservation[];
        roomTypeStats: { type: string; percentage: number }[];
        upcomingCheckouts: Reservation[];
    }> {
        try {
            console.log('Fetching stats for hotel:', hotelId);
            const response = await api.get(`${this.BASE_PATH}/hotel/${hotelId}/stats`);
            console.log('Hotel stats response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching hotel stats:', error);
            throw error;
        }
    }
}
