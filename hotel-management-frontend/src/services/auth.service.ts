import axios from 'axios';
import { User, UserRole } from '../types/user.type';

const API_URL = 'http://localhost:8080/api/auth';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    role?: UserRole;
    active?: boolean;
}

export interface LoginResponse {
    id: number;      // The user ID from the backend
    role: UserRole;
    email: string;
    token: string;
    username: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

class AuthService {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            console.log('Raw login response:', response);
            
            if (response.data) {
                // Store the login response data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async signup(signupRequest: SignupRequest): Promise<AuthResponse> {
        try {
            const response = await axios.post(`${API_URL}/signup`, {
                ...signupRequest,
                role: UserRole.ADMIN,
                active: true
            });
            if (response.data) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getCurrentUser(): LoginResponse | null {
        try {
            const userStr = localStorage.getItem('user');
            console.log('Raw stored user string:', userStr);
            
            if (!userStr) {
                console.log('No user data found in localStorage');
                return null;
            }

            const userData = JSON.parse(userStr);
            console.log('Parsed user data:', userData);

            // Check if we have the expected user structure
            if (!userData || !userData.email || !userData.role) {
                console.log('Invalid user data structure:', userData);
                return null;
            }

            return userData;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}

export default new AuthService();
