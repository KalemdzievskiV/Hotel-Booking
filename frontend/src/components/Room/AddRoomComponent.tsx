import React, { useState, useEffect } from "react";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import RoomService from "../../services/RoomService";
import UserRole from "../../enum/user.enum";
import RoomStatus from "../../enum/room/room.status.enum";
import UserService from "../../services/UserService";

interface AddRoomComponentProps {
  onClose: () => void;
  roomToUpdate?: {
    id: number;
    number: string;
    name: string;
    status: string;
    description: string;
    maxCapacity: number;
  };
}

export default function AddRoomComponent({
  onClose,
  roomToUpdate,
}: AddRoomComponentProps) {
  const [room, setRoom] = useState({
    id: 0,
    number: "",
    name: "",
    status: "",
    description: "",
    maxCapacity: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  // If roomToUpdate is provided, populate the fields with existing room data
  useEffect(() => {
    if (roomToUpdate) {
      setRoom(roomToUpdate);
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [roomToUpdate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRoom({ ...room, [name]: value });
  };

  const handleAddRoom = async () => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user) {
      console.error('No user found');
      return;
    }

    const roomData = {
      ...room,
      user: {
        id: user.id  // Only send the user ID
      }
    };

    try {
      if (isEditing && roomToUpdate) {
        await RoomService.updateRoom(roomData);
      } else {
        const { id, ...newRoomData } = roomData; // Remove id when creating new room
        await RoomService.createNewRoom(newRoomData);
      }
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving room:', error);
    }
  };

  return (
    <div>
      <Typography variant="h6">
        {isEditing ? "Edit Room" : "Add Room"}
      </Typography>
      <form>
        <TextField
          name="number"
          label="Room Number"
          value={room.number}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="name"
          label="Room Name"
          fullWidth
          margin="normal"
          value={room.name}
          onChange={handleChange}
        />
        <TextField
          name="status"
          label="Status"
          select
          value={room.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {Object.values(RoomStatus).map((status) => (
            <MenuItem
              defaultValue={RoomStatus.AVAILABLE}
              key={status}
              value={status}
            >
              {status}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="description"
          label="Description"
          type="text"
          value={room.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="maxCapacity"
          label="Max Capacity"
          type="number"
          value={room.maxCapacity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRoom}
        >
          {isEditing ? "Update Room" : "Add Room"}
        </Button>
      </form>
    </div>
  );
}
