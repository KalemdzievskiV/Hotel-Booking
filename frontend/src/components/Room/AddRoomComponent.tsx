import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@mui/material";
import RoomService from "../../services/RoomService";

interface AddRoomComponentProps {
  onClose: () => void;
  roomToUpdate?: {
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

  const handleAddRoom = () => {
    RoomService.createNewRoom(room);
    // After successful addition, close the modal and refresh the page
    onClose();
    window.location.reload();
  };

  const handleEditRoom = () => {
    RoomService.updateRoom(room);
    // After successful update, close the modal and refresh the page
    onClose();
    window.location.reload();
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
          type="text"
          value={room.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
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
          onClick={isEditing ? handleEditRoom : handleAddRoom}
        >
          {isEditing ? "Update Room" : "Add Room"}
        </Button>
      </form>
    </div>
  );
}
