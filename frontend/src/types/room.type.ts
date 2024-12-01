import RoomStatus from "../enum/room/room.status.enum";

export interface RoomImage {
    id: number;
    url: string;
    room: Room;
}

export interface Room {
    id: number;
    number: string;
    name: string;
    status: RoomStatus;
    description: string;
    maxCapacity: number;
    images?: RoomImage[];
}