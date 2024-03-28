import Calendar from "./Calendar";
import NavBar from "../Layout/NavBar";
import { Reservation } from "../../types/reservation.type";
import { useEffect, useState } from "react";
import ReservationService from "../../services/ReservationService";
import { Box, IconButton, Modal } from "@mui/material";
import AddReservationComponent from "../Reservation/AddReservationComponent";

export default function CalendarComponent() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    ReservationService.getReservationList().then((data) =>
      setReservations(data)
    );
  });

  const events = reservations.map((reservation) => ({
    start: new Date(reservation.start),
    end: new Date(reservation.finish),
    title: reservation.user.firstName,
  }));

  const handleSelectEvent = (event: any) => {
    console.log("Selected event:");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReservation(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <NavBar />
      <Calendar
        events={events}
        defaultView="week"
        selectable
        onSelectSlot={openModal}
      />
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
    </div>
  );
}
