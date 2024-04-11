import Calendar from "./Calendar";
import NavBar from "../Layout/NavBar";
import { Reservation } from "../../types/reservation.type";
import { useEffect, useState } from "react";
import ReservationService from "../../services/ReservationService";
import { Box, IconButton, Modal } from "@mui/material";
import AddReservationComponent from "../Reservation/AddReservationComponent";
import { SlotInfo } from "react-big-calendar";
import dayjs from "dayjs";
import Filter from "../Layout/Filter";
import ReservationStatus from "../../enum/reservation/reservation.status.enum";
import { useLocation } from "react-router-dom";
import AppointmentEvent from "./ReservationEvent";

export default function CalendarComponent() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const location = useLocation();

  

  useEffect(() => {
    ReservationService.getReservationList().then((data) =>
      setReservations(data)
    );
    const searchParams = new URLSearchParams(location.search);
    const roomId = searchParams.get('roomId');
    setRoomId(roomId ? parseInt(roomId) : null);
    console.log('Room ID:', roomId);
    handleFilterChange(roomId ? parseInt(roomId) : -1);
  }, []);

  const openModal = ({ start, end }: SlotInfo) => {
    console.log("slot select: ", start, end);
    setSelectedSlot({ start, end });
    setIsModalOpen(true);
  };

  const openEditModal = (reservation: Reservation) => {
    //setSelectedReservation(reservation);
    console.log("reservation select: ", reservation);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setSelectedReservation(null);
    setIsModalOpen(false);
  };

  const handleFilterChange = (selectedValue: number) => {
    if ((selectedValue === undefined || selectedValue === -1 || selectedValue === null) && roomId !== null) {
      selectedValue = roomId;
      ReservationService.getReservationByRoomId(roomId).then((data) =>
        setReservations(data)
      );
      return;
    }
    else if (
      selectedValue === undefined ||
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
      setRoomId(selectedValue);
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
      reservation.status === ReservationStatus.COMPLETED ? "orange" :
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
      <Filter title="Room" service="room" onChange={handleFilterChange} roomId={roomId}/>
      <Calendar
        style={{ marginTop: 20, marginRight: 5, marginLeft: 5}}
        events={events}
        defaultView="week"
        selectable
        onSelectSlot={openModal}
        onSelectEvent={(event, e) => reservations.map((reservation) => openEditModal(reservation))}
        eventPropGetter={eventStyleGetter}
        allDayAccessor={() => false}
        showMultiDayTimes
        endAccessor={({ end }) => new Date((end ?? new Date()).getTime() - 1)}
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
