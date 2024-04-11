import { useEffect, useState } from "react";
import "./App.css";
import AppRoutes from "./components/app/Routes";
import { Reservation } from "./types/reservation.type";
import ReservationService from "./services/ReservationService";
import moment from "moment";
import ReservationStatus from "./enum/reservation/reservation.status.enum";
import { Room } from "./types/room.type";
import RoomService from "./services/RoomService";
import RoomStatus from "./enum/room/room.status.enum";

function App() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const reservations = await ReservationService.getReservationList();
      setReservations(reservations);
      const rooms = await RoomService.getRoomList();
      setRooms(rooms);
      changeReservationStatus(reservations);
      changeRoomStatus(rooms);
    };
    fetchData();

  const interval = setInterval(fetchData, 1000 * 60 * 3);

  return () => clearInterval(interval);
  }, []);

  const changeReservationStatus = async (reservations: Reservation[]) => {
    if (reservations.length > 0) {
      reservations.forEach((reservation) => {
        const currentDateTime = moment();
        if (
          moment(reservation.start).isSameOrBefore(currentDateTime) &&
          moment(reservation.finish).isAfter(currentDateTime) &&
          reservation.status !== ReservationStatus.ACTIVE
        ) {
          reservation.status = ReservationStatus.ACTIVE;
          ReservationService.updateReservation(reservation).then(() => {
            console.log("Reservation status updated");
          });
        } else if (
          reservation.status === ReservationStatus.ACTIVE &&
          moment(reservation.finish).isBefore(currentDateTime)
        ) {
          reservation.status = ReservationStatus.COMPLETED;
          ReservationService.updateReservation(reservation).then(() => {
            console.log("Reservation status updated");
          });
        }
      });
    }
  };

  const changeRoomStatus = async (rooms: Room[]) => {
    rooms.forEach(async (room) => {
      const reservations = await ReservationService.getReservationByRoomId(
        room.id
      );
      if (reservations.length === 0) {
        room.status = RoomStatus.AVAILABLE;
        RoomService.updateRoom(room);
        return;
      }
      const hasReservations = reservations.some((reservation: Reservation) => {
        return (
          reservation.status === ReservationStatus.ACTIVE
        );
      });
      if (hasReservations) {
        room.status = RoomStatus.OCCUPIED;
      } else {
        room.status = RoomStatus.AVAILABLE;
      }
      RoomService.updateRoom(room);
    });
  };

  return (
    <div>
      <AppRoutes />
    </div>
  );
}

export default App;
