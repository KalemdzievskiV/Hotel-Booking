import { api } from './api.config';
import { User } from '../types/user.type';

export class UserService {
    private static readonly BASE_PATH = '/users';

    static async createUser(user: User): Promise<User> {
        const response = await api.post(this.BASE_PATH, user);
        return response.data;
    }

    static async updateUser(id: number, user: User): Promise<User> {
        const response = await api.put(`${this.BASE_PATH}/${id}`, user);
        return response.data;
    }

    static async getUser(id: number): Promise<User> {
        const response = await api.get(`${this.BASE_PATH}/${id}`);
        return response.data;
    }

    static async getUserByEmail(email: string): Promise<User> {
        const response = await api.get(`${this.BASE_PATH}/email/${email}`);
        return response.data;
    }

    static async getUserByEmailAndActive(email: string, active: boolean): Promise<User> {
        const response = await api.get(`${this.BASE_PATH}/email/${email}/active/${active}`);
        return response.data;
    }

    static async getAllUsers(): Promise<User[]> {
        const response = await api.get(this.BASE_PATH);
        return response.data;
    }

    static async deleteUser(id: number): Promise<void> {
        await api.delete(`${this.BASE_PATH}/${id}`);
    }

    static async activateUser(id: number): Promise<void> {
        await api.post(`${this.BASE_PATH}/${id}/activate`);
    }

    static async deactivateUser(id: number): Promise<void> {
        await api.post(`${this.BASE_PATH}/${id}/deactivate`);
    }

    static async checkEmailExists(email: string): Promise<boolean> {
        const response = await api.get(`${this.BASE_PATH}/check-email`, {
            params: { email }
        });
        return response.data;
    }
}
