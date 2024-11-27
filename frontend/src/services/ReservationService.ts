import axios from "axios";

const BASE_URL = "http://localhost:8080";

class ReservationService {
static async getReservationList() {
    const response = await axios.get(`${BASE_URL}/reservation/list`);
    return response.data;
}

static async getReservationsPageable(
    page: number, 
    size: number, 
    sortBy: string = 'start',
    sortDirection: 'asc' | 'desc' = 'desc'
) {
    const response = await axios.get(`${BASE_URL}/reservation/pageable`, {
        params: {
            page,
            size,
            sort: `${sortBy},${sortDirection}`
        }
    });
    return {
        data: response.data.content,
        totalCount: response.data.totalElements
    };
}

static async createNewReservation(reservation: any) {
    const response = await axios.post(`${BASE_URL}/reservation/add`, reservation);
    return response.data;
}

static async updateReservation(reservation: any) {
    const response = await axios.put(`${BASE_URL}/reservation/update`, reservation);
    return response.data;
}

static async getReservationById(id: number) {
    const response = await axios.get(`${BASE_URL}/reservation/find/${id}`);
    return response.data;
}

static async getReservationByRoomId(id: number) {
    const response = await axios.get(`${BASE_URL}/reservation/find/room/${id}`);
    return response.data;
}

static async deleteReservation(id: number) {
    const response = await axios.delete(`${BASE_URL}/reservation/delete/${id}`);
    return response.data;
}

}
export default ReservationService;