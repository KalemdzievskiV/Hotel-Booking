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
    // ReservationService.getReservationList().then((data) => {
    //   setReservations(data);
    // });
    // RoomService.getRoomList().then((data) => {
    //   setRooms(data);
    // });
    // changeReservationStatus();
    // changeRoomStatus();
    // const interval = setInterval(() => {
    //   changeReservationStatus();
    //   changeRoomStatus();
    // }, 1000 * 30);
    // return () => clearInterval(interval);
    const fetchData = async () => {
      const reservations = await ReservationService.getReservationList();
      setReservations(reservations);
      const rooms = await RoomService.getRoomList();
      setRooms(rooms);
      changeReservationStatus(reservations);
      changeRoomStatus(rooms);
    };
    fetchData();

  const interval = setInterval(fetchData, 1000 * 30);

  return () => clearInterval(interval);
  }, []);

  

  const getReservationList = async () => {
    const data = await ReservationService.getReservationList();
    setReservations(data);
    console.log("Reservations: ", reservations);
  }

  const getRoomList = async () => {
    const data = await RoomService.getRoomList();
    setRooms(data);
    console.log("Rooms: ", rooms);
  }

  const changeReservationStatus = async (reservations: Reservation[]) => {
    console.log("Changing reservation status");
    //await getReservationList();
    console.log("Reservations: ", reservations);
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
    console.log("Changing room status");
    //await getRoomList();
    console.log("Rooms: ", rooms);
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
