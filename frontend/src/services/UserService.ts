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

static async getUserListPageable(page: number = 0, rowsPerPage: number = 10) {
    const response = await axios.get(`${BASE_URL}/user/pageable?page=${page}&size=${rowsPerPage}`);
    return {
        data: response.data.content,
        totalCount: response.data.totalElements
    };
}

static async getUserByFirstName(firstName: string) {
    const response = await axios.get(`${BASE_URL}/user/find/firstName/${firstName}`);
    return response.data;
}
}

export default UserService;