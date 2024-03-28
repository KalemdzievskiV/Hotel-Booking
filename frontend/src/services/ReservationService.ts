import axios from "axios";

const BASE_URL = "http://localhost:8080";

class ReservationService {
static async getReservationList() {
    const response = await axios.get(`${BASE_URL}/reservation/list`);
    return response.data;
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



}
export default ReservationService;