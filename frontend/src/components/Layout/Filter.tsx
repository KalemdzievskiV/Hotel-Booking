import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Reservation } from "../../types/reservation.type";
import { Room } from "../../types/room.type";
import { title } from "process";
import { ChangeEvent, useEffect, useState } from "react";
import RoomService from "../../services/RoomService";
import ReservationService from "../../services/ReservationService";
import UserService from "../../services/UserService";
import { User } from "../../types/user.type";

export interface FilterProps {
    title: string;
    service: string;
    onChange: (value: number) => void;
    roomId: number | null;
}

export default function Filter(props: FilterProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedValue, setSelectedValue] = useState<number>(0);
  const roomId = props.roomId;
  useEffect(() => {
    if (props.service === "room") {
      RoomService.getRoomList().then((data) => setRooms(data));
    }
  }, []);
  useEffect(() => {
    if (props.service === "reservation") {
      ReservationService.getReservationList().then((data) =>
        setReservations(data)
      );
    }
  }, []);
function handleChange(event : ChangeEvent<{ value: unknown }>) {
    setSelectedValue(event.target.value as unknown as number);
}

  return (
    <div style={{ margin: "1%", width: "10%" }}>
      <FormControl sx={{ width: "200px" }}>
        <InputLabel key={props.title} id="title-select-label">{props.title}</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={roomId ? roomId : selectedValue}
            label="Filter"
            onChange={(event) => {
                props.onChange(event?.target?.value as unknown as number);
                handleChange(event as ChangeEvent<{ value: unknown }>);
            }}
        >
            <MenuItem value={0}>All</MenuItem>
          {props.service === "room" &&
            rooms.map((room) => (
              <MenuItem key={room.id} value={room.id}>{room.number}</MenuItem>
            ))}
          {props.service === "reservation" &&
            reservations.map((reservation) => (
              <MenuItem key={reservation.id} value={reservation.id}>{reservation.id}</MenuItem>
            ))}
          {props.service === "user" &&
            users.map((user) => (
              <MenuItem key={user.id} value={user.id}>{user.firstName}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
