import NavBar from "../Layout/NavBar";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import RoomService from "../../services/RoomService";
import { Room } from "../../types/room.type";
import { Box, Button, IconButton, Modal } from "@mui/material";
import AddRoomComponent from "./AddRoomComponent";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function RoomComponent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    RoomService.getRoomList().then((data) => setRooms(data));
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setIsModalOpen(false);
  };

  const editRoom = (room: Room) => {
    setIsModalOpen(true);
    setSelectedRoom(room); // Set the selected room
  };
  return (
    <>
      <NavBar />
      <div className="mx-3 mb-2">
        <Button variant="outlined" color="success" onClick={openModal}>
          Add Room
        </Button>
      </div>
      <TableContainer component={Paper} className="w-fit">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Number</StyledTableCell>
              <StyledTableCell align="right">Name</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right">description</StyledTableCell>
              <StyledTableCell align="right">maxCapacity</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <StyledTableRow
                key={room.id}
                onDoubleClick={() => editRoom(room)}
                style={{ cursor: "pointer" }}
              >
                <StyledTableCell component="th" scope="row">
                  {room.number}
                </StyledTableCell>
                <StyledTableCell align="right">{room.name}</StyledTableCell>
                <StyledTableCell align="right">{room.status}</StyledTableCell>
                <StyledTableCell align="right">
                  {room.description}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {room.maxCapacity}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <IconButton
            onClick={closeModal}
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
            }}
          ></IconButton>
          <AddRoomComponent roomToUpdate={selectedRoom!} onClose={closeModal} />
        </Box>
      </Modal>
    </>
  );
}
