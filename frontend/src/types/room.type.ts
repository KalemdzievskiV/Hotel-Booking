import RoomStatus from "../enum/room/room.status.enum";

export interface Room {
    id: number;
    number: string;
    name: string;
    status: RoomStatus;
    description: string;
    maxCapacity: number;
  }