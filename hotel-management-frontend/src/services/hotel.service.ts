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

    static async getCurrentUserHotel(): Promise<Hotel | null> {
        try {
            console.log('Fetching current user\'s hotel...');
            const response = await api.get(`${this.BASE_PATH}/current`);
            console.log('Get current user\'s hotel response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error getting current user\'s hotel:', error.response?.data || error.message);
            return null;
        }
    }

    static async uploadPictures(id: number, formData: FormData): Promise<Hotel> {
        console.log('Uploading pictures for hotel with id:', id);
        // First get the current hotel data
        const currentHotel = await this.getHotel(id);
        
        // Extract pictures from FormData
        const pictures: string[] = [];
        const pictureFiles = formData.getAll('pictures');
        for (const file of pictureFiles) {
            // Convert each file to base64
            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file as Blob);
            });
            pictures.push(base64);
        }

        // Merge new pictures with existing ones
        const updatedHotel = {
            ...currentHotel,
            pictures: [...(currentHotel.pictures || []), ...pictures]
        };

        // Use the update endpoint
        const response = await api.put(`${this.BASE_PATH}/${id}`, updatedHotel);
        console.log('Upload pictures response:', response.data);
        return response.data;
    }
}
