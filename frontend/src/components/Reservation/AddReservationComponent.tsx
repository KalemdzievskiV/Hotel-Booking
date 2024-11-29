import React, { useState, useEffect } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Box,
  Divider,
  Stack,
  Avatar,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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
import { AccessTime, Person, MeetingRoom } from "@mui/icons-material";
import RoomStatus from "../../enum/room/room.status.enum";
import axios from 'axios';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  width: '100%',
}));

interface AddReservationComponentProps {
  onClose: () => void;
  reservationToUpdate?: {
    start: Date;
    finish: Date;
    user: User;
    room: Room;
    status: string;
  };
  start: Date;
  end: Date;
  selectedRoom?: Room;
}

export default function AddReservationComponent({
  onClose,
  reservationToUpdate,
  start,
  end,
  selectedRoom,
}: AddReservationComponentProps) {
  const [reservation, setReservation] = useState<{
    start: Date;
    finish: Date;
    user: Partial<User>;
    room: Partial<Room>;
    status: string;
  }>({
    start: start,
    finish: end,
    user: {},
    room: selectedRoom || {},
    status: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | undefined>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room, setRoom] = useState<Room | undefined>();

  useEffect(() => {
    UserService.getUsers().then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    RoomService.getRoomList().then((data) => setRooms(data));
  }, []);

  useEffect(() => {
    if (reservationToUpdate) {
      setReservation({
        ...reservationToUpdate,
        status: reservationToUpdate.status
      });
      setIsEditing(true);
    } else {
      setReservation({
        start: start,
        finish: end,
        user: {},
        room: selectedRoom || {},
        status: '',
      });
      setIsEditing(false);
    }
  }, [reservationToUpdate, start, end, selectedRoom]);

  const handleChange = (
    event: SelectChangeEvent<number> | React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    if (name === "user") {
      const selectedUser = users.find((user) => user.id === value);
      setUser(selectedUser || undefined);
      setReservation({ ...reservation, user: selectedUser || {} });
    } else if (name === "room") {
      const selectedRoom = rooms.find((room) => room.id === value);
      setRoom(selectedRoom || undefined);
      setReservation({ ...reservation, room: selectedRoom || {} });
    }
  };

  const handleAddReservation = async () => {
    try {
      if (
        !reservation.start ||
        !reservation.finish ||
        !reservation.user?.id ||
        !reservation.room?.id
      ) {
        alert("Please fill in all fields");
        return;
      }

      const formattedReservation = {
        start: dayjs(reservation.start).format("YYYY-MM-DDTHH:mm:ss"),
        finish: dayjs(reservation.finish).format("YYYY-MM-DDTHH:mm:ss"),
        user: { id: reservation.user.id },
        room: { id: reservation.room.id }     
      };

      console.log('Sending reservation:', formattedReservation);
      
      await ReservationService.createNewReservation(formattedReservation);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error creating reservation:', error);
      if (axios.isAxiosError(error)) {
        alert(`Error creating reservation: ${error.response?.data?.message || error.message}`);
      } else {
        alert('Error creating reservation. Please try again.');
      }
    }
  };

  return (
    <>
      <DialogTitle>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          {isEditing ? "Edit Reservation" : "New Reservation"}
        </Typography>
      </DialogTitle>
      <Divider />
      <StyledDialogContent>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccessTime color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Time Details
            </Typography>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction="row" spacing={2}>
              <DateTimePicker
                label="Start Time"
                value={dayjs(reservation.start)}
                onChange={(value) =>
                  setReservation({ ...reservation, start: value?.toDate()! })
                }
                sx={{ flex: 1 }}
              />
              <DateTimePicker
                label="End Time"
                value={dayjs(reservation.finish)}
                onChange={(value) => {
                  if (value) {
                    const date = value.toDate();
                    // Set the seconds to 59.999
                    date.setSeconds(59, 999);
                    setReservation({ ...reservation, finish: date });
                  }
                }}
                sx={{ flex: 1 }}
              />
            </Stack>
          </LocalizationProvider>

          <Divider />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Guest Information
            </Typography>
          </Box>
          <StyledFormControl>
            <InputLabel id="select-user">Select Guest</InputLabel>
            <Select
              labelId="select-user"
              id="select-user"
              value={reservation.user?.id ?? ''}
              label="Select Guest"
              name="user"
              onChange={(event: SelectChangeEvent<number>) =>
                handleChange(event as any)
              }
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {user.firstName.charAt(0)}
                    </Avatar>
                    <Typography>
                      {user.firstName} {user.lastName}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>

          <Divider />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MeetingRoom color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Room Details
            </Typography>
          </Box>
          <StyledFormControl>
            <InputLabel id="select-room">Select Room</InputLabel>
            <Select
              labelId="select-room"
              id="select-room"
              value={reservation.room?.id ?? ''}
              label="Select Room"
              name="room"
              onChange={(event: SelectChangeEvent<number>) =>
                handleChange(event as any)
              }
              //disabled={selectedRoom !== undefined}
            >
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle1">
                      Room {room.number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({room.name})
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Stack>
      </StyledDialogContent>
      <Divider />
      <DialogActions sx={{ padding: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleAddReservation}
          variant="contained"
          color="primary"
        >
          {isEditing ? "Update Reservation" : "Create Reservation"}
        </Button>
      </DialogActions>
    </>
  );
}
