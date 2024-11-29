import Calendar from "./Calendar";
import NewNavBar from "../Layout/NewNavBar";
import { Reservation } from "../../types/reservation.type";
import { useEffect, useState } from "react";
import ReservationService from "../../services/ReservationService";
import { Box, IconButton, Modal, Paper } from "@mui/material";
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
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
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

  interface CalendarEvent {
    start: Date;
    end: Date;
    title: string;
    color: string;
  }

  const events: CalendarEvent[] = reservations
    .filter((reservation): reservation is Reservation => {
      return !!reservation && !!reservation.room && !!reservation.user;
    })
    .map((reservation) => ({
      start: new Date(reservation.start),
      end: new Date(reservation.finish),
      title: `Room: ${reservation.room.number || 'Unknown'} - User: ${reservation.user.firstName || 'Unknown'}`,
      color:  
        reservation.status === ReservationStatus.ACTIVE ? "#86efac" :    // Pastel green
        reservation.status === ReservationStatus.COMPLETED ? "#fdba74" : // Pastel orange
        reservation.status === ReservationStatus.CANCELED ? "#fca5a5" :  // Pastel red
        "#93c5fd",  // Pastel blue (default)
    }));

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
    <NewNavBar>
      <Box sx={{ 
        flexGrow: 1,
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        padding: "20px"
      }}>
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#f4f6f8",
            padding: "20px",
            margin: "0"
          }}
        >
          <Filter 
            title="Room" 
            service="room" 
            onChange={handleFilterChange} 
            roomId={roomId}
          />
          <Box sx={{ 
            mt: 2,
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <Calendar
              style={{ 
                height: 'calc(100vh - 200px)',
                padding: '20px'
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
          </Box>
        </Paper>

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
      </Box>
    </NewNavBar>
  );
}
