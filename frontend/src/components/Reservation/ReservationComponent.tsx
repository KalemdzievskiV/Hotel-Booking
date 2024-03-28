import NavBar from "../Layout/NavBar";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";
import ReservationService from "../../services/ReservationService";
import { Reservation } from "../../types/reservation.type";
import { Box, Button, IconButton, Modal } from "@mui/material";
import AddReservationComponent from "./AddReservationComponent";

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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ReservationComponent() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

    useEffect(() => {
        ReservationService.getReservationList().then((data) => setReservations(data));
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedReservation(null);
        setIsModalOpen(false);
    };

    const editReservation = (reservation: Reservation) => {
        setIsModalOpen(true);
        setSelectedReservation(reservation); // Set the selected reservation
    };

    useEffect(() => {
        ReservationService.getReservationList().then((data) => setReservations(data));
    }, [])

  return (
    <>
    <NavBar/>
    <div className="mx-3 mb-2">
      <Button variant="outlined" color="success" onClick={openModal}>Add Reservation</Button>
    </div>
    <TableContainer component={Paper} className="w-fit">
      <Table  aria-label="customized table" >
        <TableHead>
          <TableRow>
            <StyledTableCell>Start</StyledTableCell>
            <StyledTableCell align="right">End</StyledTableCell>
            <StyledTableCell align="right">User</StyledTableCell>
            <StyledTableCell align="right">Room</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reservations.map((reservation) => (
            <StyledTableRow key={reservation.id}>
              <StyledTableCell component="th" scope="row">
                {reservation.start.toString()}
              </StyledTableCell>
              <StyledTableCell align="right">{reservation.finish.toString()}</StyledTableCell>
              <StyledTableCell align="right">{reservation.user.firstName}</StyledTableCell>
              <StyledTableCell align="right">{reservation.room.description}</StyledTableCell>
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
          >
          </IconButton>
          <AddReservationComponent reservationToUpdate={selectedReservation!} onClose={closeModal} />
        </Box>
      </Modal>
    </>
  );
}