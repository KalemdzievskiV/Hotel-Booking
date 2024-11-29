import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

export interface User {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

export interface AuthResponse {
    token: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export const authService = {
    login: async (credentials: Pick<User, 'email' | 'password'>): Promise<AuthResponse> => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            console.log('Raw login response:', response);
            console.log('Login response data:', response.data);
            
            if (!response.data) {
                throw new Error('No data received from server');
            }

            if (!response.data.email || !response.data.firstName || !response.data.lastName) {
                console.error('Missing user data in response:', response.data);
                throw new Error('Incomplete user data received');
            }

            // Create a user object from the response data
            const userData = {
                id: response.data.id,
                email: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                role: response.data.role
            };
            
            console.log('Constructed user data:', userData);

            // Store the token
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            // Store the user data
            localStorage.setItem('user', JSON.stringify(userData));
            
            console.log('Stored user data:', localStorage.getItem('user'));
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    signup: async (userData: User): Promise<AuthResponse> => {
        try {
            const response = await axios.post(`${API_URL}/signup`, userData);
            console.log('Signup response:', response.data);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                const userData = {
                    email: response.data.email,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    role: response.data.role
                };
                localStorage.setItem('user', JSON.stringify(userData));
            }
            return response.data;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            console.log('Retrieved user string from storage:', userStr);
            
            if (!userStr) {
                console.log('No user data found in storage');
                return null;
            }

            const user = JSON.parse(userStr);
            console.log('Parsed user data:', user);
            return user;
        } catch (error) {
            console.error('Error getting current user:', error);
            localStorage.removeItem('user'); // Clean up invalid data
            return null;
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    }
};
