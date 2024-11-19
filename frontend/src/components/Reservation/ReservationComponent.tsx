import NavBar from "../Layout/NavBar";
import { Box, Button, IconButton, Modal, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import ReservationService from "../../services/ReservationService";
import { Reservation } from "../../types/reservation.type";
import AddReservationComponent from "./AddReservationComponent";
import CloseIcon from "@mui/icons-material/Close";
import CustomTable from "../shared/CustomTable";

export default function ReservationComponent() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const columns = [
    { id: 'start', label: 'Start' },
    { id: 'finish', label: 'End', align: 'center' as const },
    { id: 'user', label: 'User', align: 'center' as const },
    { id: 'room', label: 'Room', align: 'center' as const },
  ];

  const renderCell = (column: { id: string }, reservation: Reservation) => {
    switch (column.id) {
      case 'start':
        return reservation.start.toString();
      case 'finish':
        return reservation.finish.toString();
      case 'user':
        return reservation.user.firstName;
      case 'room':
        return reservation.room.description;
      default:
        return '';
    }
  };

  useEffect(() => {
    ReservationService.getReservationList().then((data) => {
      setReservations(data);
    });
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setSelectedReservation(null);
    setIsModalOpen(false);
  };
  const editReservation = (reservation: Reservation) => {
    setIsModalOpen(true);
    setSelectedReservation(reservation);
  };

  return (
    <>
      <NavBar />
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          margin: "auto",
          marginTop: "2vh",
          maxWidth: "90%",
          backgroundColor: "#f4f6f8",
        }}
      >
        <div className="mx-3 mb-2" style={{ textAlign: "right" }}>
          <Button
            variant="outlined"
            color="success"
            onClick={openModal}
            style={{ marginBottom: "20px" }}
          >
            Add Reservation
          </Button>
        </div>
        
        <CustomTable
          columns={columns}
          data={reservations}
          onEdit={editReservation}
          onDelete={(reservation) => console.log('Delete reservation', reservation.id)}
          renderCell={renderCell}
        />
      </Paper>

      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            textAlign: "center",
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
            <CloseIcon />
          </IconButton>
          <AddReservationComponent
            start={new Date()}
            end={new Date()}
            reservationToUpdate={selectedReservation!}
            onClose={closeModal}
          />
        </Box>
      </Modal>
    </>
  );
}
