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

static async getRoomByStatus(status: string) {
    const response = await axios.get(`${BASE_URL}/room/find/status/${status}`);
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

static async deleteRoom(id: number) {
    const response = await axios.delete(`${BASE_URL}/room/delete/${id}`);
    return response.data;
}

static async getAvailableRooms() {
    const response = await axios.get(`${BASE_URL}/room/find/available`);
    return response.data;
}

static async getAvailableRoomsInFiveHours() {
    const response = await axios.get(`${BASE_URL}/room/find/available/five-hours`);
    return response.data;
}

static async getAvailableRoomsInOneDay() {
    const response = await axios.get(`${BASE_URL}/room/find/available/one-day`);
    return response.data;
}

static async getAvailableRoomsInDateRange(selectedTime: String) {
    const response = await axios.get(`${BASE_URL}/room/find/available/${selectedTime}`);
    return response.data;
}

static async getRoomListPageable(page: number = 0, rowsPerPage: number = 10) {
    const response = await axios.get(`${BASE_URL}/room/pageable?page=${page}&size=${rowsPerPage}`);
    return {
        data: response.data.content,
        totalCount: response.data.totalElements
    };
}

}
export default RoomService;