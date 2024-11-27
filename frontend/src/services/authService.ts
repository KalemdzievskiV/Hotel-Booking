import axios from 'axios';

const API_URL = 'http://localhost:8080/auth';

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const authService = {
    login: async (data: LoginData) => {
        const response = await axios.post(`${API_URL}/login`, data);
        console.log('Login response:', response.data);
        
        const userData = {
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            role: response.data.role
        };

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(userData));
        }
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await axios.post(`${API_URL}/signup`, data);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default authService;
