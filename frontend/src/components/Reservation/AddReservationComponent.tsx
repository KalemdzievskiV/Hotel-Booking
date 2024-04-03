import React, { useState, useEffect } from "react";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import ReservationService from "../../services/ReservationService";
import { User } from "../../types/user.type";
import { Room } from "../../types/room.type";
import UserService from "../../services/UserService";
import RoomService from "../../services/RoomService";
import {
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface AddReservationComponentProps {
  onClose: () => void;
  reservationToUpdate?: {
    start: Date;
    finish: Date;
    user: User;
    room: Room;
  };
  start: Date;
  end: Date;
}

export default function AddReservationComponent({
  onClose,
  reservationToUpdate,
  start,
  end,
}: AddReservationComponentProps) {
  const [reservation, setReservation] = useState({
    start: start,
    finish: end,
    user: {} as User,
    room: {} as Room,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    UserService.getUsers().then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    RoomService.getRoomList().then((data) => setRooms(data));
  }, []);

  // If reservationToUpdate is provided, populate the fields with existing reservation data
  useEffect(() => {
    if (reservationToUpdate) {
      setReservation(reservationToUpdate);
      setIsEditing(true);
    } else {
      setReservation({
        start: start,
        finish: end,
        user: {} as User,
        room: {} as Room,
      });
      setIsEditing(false);
    }
  }, [reservationToUpdate]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target;

    // Check if the changed input is the user or room select, and update the state accordingly
    if (name === "user") {
      const selectedUser =
        users.find((user) => user.id === value) || ({} as User);
      setUser(selectedUser);
      setReservation({ ...reservation, user: selectedUser });
    } else if (name === "room") {
      const selectedRoom =
        rooms.find((room) => room.id === value) || ({} as Room);
      setRoom(selectedRoom);
      setReservation({ ...reservation, room: selectedRoom });
    } else {
      // For other inputs like start and finish, update directly in the reservation state
      setReservation({ ...reservation, [name as string]: value });
    }
  };

  const handleAddReservation = () => {
    if (
      !reservation.start ||
      !reservation.finish ||
      !reservation.user.id ||
      !reservation.room.id
    ) {
      alert("Please fill in all fields");
      return;
    }
    reservation.start = new Date(
      dayjs(reservation.start).format("YYYY-MM-DDTHH:mm:ss+00:00")
    );
    reservation.finish = new Date(
      dayjs(reservation.finish).format("YYYY-MM-DDTHH:mm:ss+00:00")
    );
    ReservationService.createNewReservation(reservation);
    // After successful addition, close the modal and refresh the page
    onClose();
    window.location.reload();
  };

  const handleEditReservation = () => {
    if (
      !reservation.start ||
      !reservation.finish ||
      !reservation.user.id ||
      !reservation.room.id
    ) {
      alert("Please fill in all fields");
      return;
    }
    ReservationService.updateReservation(reservation);
    // After successful update, close the modal and refresh the page
    onClose();
    window.location.reload();
  };

  return (
    <div>
      <Typography variant="h6" style={{ marginBottom: "1rem" }}>
        {isEditing ? "Edit Reservation" : "Add Reservation"}
      </Typography>
      <form>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            sx={{ marginBottom: "1rem", width: "100%" }}
            value={dayjs(reservation.start)}
            label="Start"
            onChange={(value) =>
              setReservation({ ...reservation, start: value?.toDate()! }) as any
            }
          />
          <DateTimePicker
            sx={{ marginBottom: "1rem", width: "100%" }}
            value={dayjs(reservation.finish)}
            label="Finish"
            onChange={(value) =>
              setReservation({
                ...reservation,
                finish: value?.toDate()!,
              }) as any
            }
          />
        </LocalizationProvider>
        <InputLabel id="select-user">User</InputLabel>
        <Select
          required
          labelId="select-user"
          id="select-user"
          value={reservation.user.id}
          label="User"
          placeholder="Select User"
          name="user"
          style={{ width: "100%", marginBottom: "1rem" }}
          onChange={(event: SelectChangeEvent<number>) =>
            handleChange(event as any)
          }
        >
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.firstName}
            </MenuItem>
          ))}
        </Select>
        <InputLabel id="select-room">Room</InputLabel>
        <Select
          required
          labelId="select-room"
          id="select-room"
          value={reservation.room.id}
          label="Room"
          placeholder="Select Room"
          name="room"
          style={{ width: "100%", marginBottom: "1rem" }}
          onChange={(event: SelectChangeEvent<number>) =>
            handleChange(event as any)
          }
        >
          {rooms.map((room) => (
            <MenuItem key={room.id} value={room.id}>
              {room.number}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={isEditing ? handleEditReservation : handleAddReservation}
        >
          {isEditing ? "Edit Reservation" : "Add Reservation"}
        </Button>
      </form>
    </div>
  );
}
