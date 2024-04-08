import Calendar from "./Calendar";
import NavBar from "../Layout/NavBar";
import { Reservation } from "../../types/reservation.type";
import { useEffect, useState } from "react";
import ReservationService from "../../services/ReservationService";
import { Box, IconButton, Modal } from "@mui/material";
import AddReservationComponent from "../Reservation/AddReservationComponent";
import { SlotInfo } from "react-big-calendar";
import dayjs, { Dayjs } from "dayjs";
import Filter from "../Layout/Filter";
import ReservationStatus from "../../enum/reservation/reservation.status.enum";

export default function CalendarComponent() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  useEffect(() => {
    ReservationService.getReservationList().then((data) =>
      setReservations(data)
    );
  }, []);

  const openModal = ({ start, end }: SlotInfo) => {
    console.log("slot select: ", start, end);
    setSelectedSlot({ start, end });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReservation(null);
    setIsModalOpen(false);
  };

  const handleFilterChange = (selectedValue: number) => {
    if (
      selectedValue === undefined ||
      selectedValue === 0 ||
      selectedValue === -1 ||
      selectedValue === null
    ) {
      ReservationService.getReservationList().then((data) =>
        setReservations(data)
      );
      return;
    } else {
      ReservationService.getReservationByRoomId(selectedValue).then((data) =>
        setReservations(data)
      );
    }
  };

  const events = reservations.map((reservation) => ({
    start: new Date(reservation.start),
    end: new Date(reservation.finish),
    title:
      "Room: " +
      reservation.room.number +
      " - User: " +
      reservation.user.firstName,
    color:  
      reservation.status === ReservationStatus.ACTIVE ? "green" :
      reservation.status === ReservationStatus.COMPLETED ? "yellow" :
      reservation.status === ReservationStatus.CANCELED ? "red" : "blue",
  }));
  
  const eventStyleGetter = (event: any, start: any, end: any, isSelected: any) => {
    var backgroundColor = event.color;
    var style = {
        backgroundColor: backgroundColor,
        borderRadius: '0px',
        border: '0px',
        display: 'block'
    };
    return {
        style: style
    };
  }
  return (
    <div>
      <NavBar />
      <Filter title="Room" service="room" onChange={handleFilterChange} />
      <Calendar
        style={{ marginTop: 20 }}
        events={events}
        defaultView="week"
        selectable
        onSelectSlot={openModal}
        eventPropGetter={eventStyleGetter}
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
          ></IconButton>
          <AddReservationComponent
            start={dayjs(selectedSlot?.start).toDate()}
            end={dayjs(selectedSlot?.end).toDate()}
            reservationToUpdate={selectedReservation!}
            onClose={closeModal}
          />
        </Box>
      </Modal>
    </div>
  );
}
