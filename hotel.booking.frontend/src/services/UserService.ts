import axios from "axios";

const BASE_URL = "http://localhost:8080";

class UserService {
static async getUsers() {
    const response = await axios.get(`${BASE_URL}/user/list`);
    return response.data;
}

static async getUserById(id: number) {
    const response = await axios.get(`${BASE_URL}/user/find/${id}`);
    return response.data;
}

static async createUser(user: any) {
    const response = await axios.post(`${BASE_URL}/user/add`, user);
    return response.data;
}

static async updateUser(user: any) {
    const response = await axios.put(`${BASE_URL}/user/update`, user);
    return response.data;
}

static async deleteUser(id: number) {
    const response = await axios.delete(`${BASE_URL}/user/delete/${id}`);
    return response.data;
}
}
export default UserService;