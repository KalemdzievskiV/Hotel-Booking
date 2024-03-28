import axios from "axios";

const BASE_URL = "http://localhost:8080";

class RoomService {
static async getRoomList() {
    const response = await axios.get(`${BASE_URL}/room/list`);
    return response.data;
}

static async getRoomById(id: number) {
    const response = await axios.get(`${BASE_URL}/room/find/${id}`);
    return response.data;
}

static async getRoomByNumber(number: number) {
    const response = await axios.get(`${BASE_URL}/room/find/${number}`);
    return response.data;
}

static async createNewRoom(room: any) {
    const response = await axios.post(`${BASE_URL}/room/add`, room);
    return response.data;
}

static async updateRoom(room: any) {
    const response = await axios.put(`${BASE_URL}/room/update`, room);
    return response.data;
}

static async deleteUser(id: number) {
    const response = await axios.delete(`${BASE_URL}/room/delete/${id}`);
    return response.data;
}
}
export default RoomService;