import { Room } from "./room.type";
import { User } from "./user.type";

export interface Reservation {
    id: number;
    start: Date;
    finish: Date;
    user:User;
    room:Room;
  }