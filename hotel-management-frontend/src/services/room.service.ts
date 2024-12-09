import { api } from './api.config';
import { Room, RoomStatus } from '../types/room.type';

export class RoomService {
    private static readonly BASE_PATH = '/rooms';

    static async createRoom(room: Room): Promise<Room> {
        const response = await api.post(this.BASE_PATH, room);
        return response.data;
    }

    static async updateRoom(id: number, room: Room): Promise<Room> {
        const response = await api.put(`${this.BASE_PATH}/${id}`, room);
        return response.data;
    }

    static async getRoom(id: number): Promise<Room> {
        const response = await api.get(`${this.BASE_PATH}/${id}`);
        return response.data;
    }

    static async getAllRooms(): Promise<Room[]> {
        const response = await api.get(this.BASE_PATH);
        return response.data;
    }

    static async getRoomsByHotel(hotelId: number): Promise<Room[]> {
        const response = await api.get(`${this.BASE_PATH}/hotel/${hotelId}`);
        return response.data;
    }

    static async getAvailableRoomsByHotel(hotelId: number): Promise<Room[]> {
        const response = await api.get(`${this.BASE_PATH}/hotel/${hotelId}/available`);
        return response.data;
    }

    static async getRoomsByPriceRange(hotelId: number, minPrice: number, maxPrice: number): Promise<Room[]> {
        const response = await api.get(`${this.BASE_PATH}/hotel/${hotelId}/price-range`, {
            params: { minPrice, maxPrice }
        });
        return response.data;
    }

    static async getAvailableRoomsByPriceRange(hotelId: number, minPrice: number, maxPrice: number): Promise<Room[]> {
        const response = await api.get(`${this.BASE_PATH}/hotel/${hotelId}/available/price-range`, {
            params: { minPrice, maxPrice }
        });
        return response.data;
    }

    static async getAvailableRoomsSortedByPrice(hotelId: number): Promise<Room[]> {
        const response = await api.get(`${this.BASE_PATH}/hotel/${hotelId}/available/sorted`);
        return response.data;
    }

    static async deleteRoom(id: number): Promise<void> {
        await api.delete(`${this.BASE_PATH}/${id}`);
    }

    static async updateRoomStatus(roomId: number, status: RoomStatus): Promise<Room> {
        const response = await api.patch(`${this.BASE_PATH}/${roomId}/status`, { status });
        return response.data;
    }

    static async updateRoomStatusByReservation(roomId: number, reservationStatus: string): Promise<Room> {
        const response = await api.patch(`${this.BASE_PATH}/${roomId}/status/by-reservation`, { reservationStatus });
        return response.data;
    }

    static async getAvailableRoomCount(hotelId: number): Promise<number> {
        const response = await api.get(`${this.BASE_PATH}/hotel/${hotelId}/available/count`);
        return response.data;
    }
}
