import { api } from './api.config';
import { Hotel } from '../types/hotel.type';

export class HotelService {
    private static readonly BASE_PATH = '/hotels';

    static async createHotel(hotel: Hotel): Promise<Hotel> {
        const response = await api.post(this.BASE_PATH, hotel);
        return response.data;
    }

    static async updateHotel(id: number, hotel: Hotel): Promise<Hotel> {
        const response = await api.put(`${this.BASE_PATH}/${id}`, hotel);
        return response.data;
    }

    static async getHotel(id: number): Promise<Hotel> {
        const response = await api.get(`${this.BASE_PATH}/${id}`);
        return response.data;
    }

    static async getAllHotels(): Promise<Hotel[]> {
        const response = await api.get(this.BASE_PATH);
        return response.data;
    }

    static async deleteHotel(id: number): Promise<void> {
        await api.delete(`${this.BASE_PATH}/${id}`);
    }

    static async searchHotels(keyword: string): Promise<Hotel[]> {
        const response = await api.get(`${this.BASE_PATH}/search`, {
            params: { keyword }
        });
        return response.data;
    }
}
