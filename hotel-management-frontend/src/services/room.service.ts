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

    static async uploadPictures(id: number, formData: FormData): Promise<Room> {
        console.log('Uploading pictures for room with id:', id);
        // First get the current room data
        const currentRoom = await this.getRoom(id);
        
        // Extract pictures from FormData
        const pictures: { url: string }[] = [];
        const pictureFiles = formData.getAll('pictures');
        for (const file of pictureFiles) {
            // Convert each file to base64
            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file as Blob);
            });
            pictures.push({ url: base64 });
        }

        // Merge new pictures with existing ones and preserve all other room data
        const updatedRoom = {
            ...currentRoom,
            pictures: [...(currentRoom.pictures || []).map(p => ({ url: p.url })), ...pictures],
            hotel: currentRoom.hotel // Ensure hotel association is preserved
        };

        // Use the update endpoint
        const response = await api.put(`${this.BASE_PATH}/${id}`, updatedRoom);
        console.log('Upload pictures response:', response.data);
        return response.data;
    }
}
