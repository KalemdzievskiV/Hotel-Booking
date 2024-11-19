import Calendar from "./Calendar";
import NavBar from "../Layout/NavBar";
import { Reservation } from "../../types/reservation.type";
import { useEffect, useState } from "react";
import ReservationService from "../../services/ReservationService";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import AddReservationComponent from "../Reservation/AddReservationComponent";
import { SlotInfo } from "react-big-calendar";
import dayjs from "dayjs";
import Filter from "../Layout/Filter";
import ReservationStatus from "../../enum/reservation/reservation.status.enum";
import { useLocation } from "react-router-dom";
import { eventStyleGetter } from './eventStyleGetter'; 
import './calendar.css';

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
    setSelectedReservation(reservation);
    console.log("reservation select: ", selectedReservation);
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
      reservation.status === ReservationStatus.ACTIVE ? "#86efac" :    // Pastel green
      reservation.status === ReservationStatus.COMPLETED ? "#fdba74" : // Pastel orange
      reservation.status === ReservationStatus.CANCELED ? "#fca5a5" :  // Pastel red
      "#93c5fd",  // Pastel blue (default)
  }));
  
  
  // const eventStyleGetter = (event: any, start: any, end: any, isSelected: any) => {
  //   var backgroundColor = event.color;
  //   var style = {
  //       backgroundColor: backgroundColor,
  //       borderRadius: '0px',
  //       border: '0px',
  //       display: 'block'
        
  //   };
  //   return {
  //       style: style
  //   };
  // }
  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: event.color,
        color: '#374151',  // Dark gray text
        opacity: 0.9,
        border: 'none',
        display: 'block'
      }
    };
  };
  return (
    <div>
      <NavBar />
      <Filter title="Room" service="room" onChange={handleFilterChange} roomId={roomId}/>
      <Calendar
        style={{ 
          marginTop: 20, 
          marginRight: 20, 
          marginLeft: 20,
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
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
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            p: 4,
          }}
        >
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
