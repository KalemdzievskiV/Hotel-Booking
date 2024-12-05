import { api } from './api.config';
import { Hotel } from '../types/hotel.type';

export class HotelService {
    private static readonly BASE_PATH = '/hotels';

    static async createHotel(hotel: Hotel): Promise<Hotel> {
        console.log('Creating hotel with data:', JSON.stringify(hotel, null, 2));
        const response = await api.post(this.BASE_PATH, hotel);
        console.log('Create hotel response:', response.data);
        return response.data;
    }

    static async updateHotel(id: number, hotel: Hotel): Promise<Hotel> {
        console.log('Updating hotel with id:', id, 'and data:', JSON.stringify(hotel, null, 2));
        const response = await api.put(`${this.BASE_PATH}/${id}`, hotel);
        console.log('Update hotel response:', response.data);
        return response.data;
    }

    static async getHotel(id: number): Promise<Hotel> {
        console.log('Fetching hotel with id:', id);
        const response = await api.get(`${this.BASE_PATH}/${id}`);
        console.log('Get hotel response:', response.data);
        return response.data;
    }

    static async getAllHotels(): Promise<Hotel[]> {
        try {
            console.log('Fetching all hotels...');
            const response = await api.get(this.BASE_PATH);
            console.log('Get all hotels response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error in getAllHotels:', error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteHotel(id: number): Promise<void> {
        console.log('Deleting hotel with id:', id);
        await api.delete(`${this.BASE_PATH}/${id}`);
    }

    static async searchHotels(keyword: string): Promise<Hotel[]> {
        console.log('Searching hotels with keyword:', keyword);
        const response = await api.get(`${this.BASE_PATH}/search`, {
            params: { keyword }
        });
        console.log('Search hotels response:', response.data);
        return response.data;
    }
}
