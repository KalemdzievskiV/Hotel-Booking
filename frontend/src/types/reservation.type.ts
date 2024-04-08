import ReservationStatus from "../enum/reservation/reservation.status.enum";
import { Room } from "./room.type";
import { User } from "./user.type";

export interface Reservation {
    id: number;
    start: Date;
    finish: Date;
    status: ReservationStatus;
    user:User;
    room:Room;
  }