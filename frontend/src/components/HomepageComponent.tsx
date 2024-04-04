import React, { useEffect, useState } from "react";
import NavBar from "./Layout/NavBar";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { Room } from "../types/room.type";
import RoomService from "../services/RoomService";
import RoomStatus from "../enum/room/room.status.enum";
import { Reservation } from "../types/reservation.type";
import ReservationService from "../services/ReservationService";

function HomepageComponent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const currentTime = new Date();
  const [title , setTitle] = useState<string>("All Available Rooms");

  useEffect(() => {
    RoomService.getRoomByStatus(RoomStatus.AVAILABLE).then((data) =>
      setRooms(data)
    );

  }, []);

  const getAvailableRooms = async (range: Date) => {
    try {
      const rooms = await RoomService.getRoomByStatus(RoomStatus.AVAILABLE);
      const filteredRooms = await Promise.all(rooms.map(async (room: Room) => {
        const reservations = await ReservationService.getReservationByRoomId(room.id);
        const hasReservations = reservations.some((reservation: Reservation) => {
          const reservationStartTime = new Date(reservation.start);
          const reservationEndTime = new Date(reservation.finish);
          return (
            reservationStartTime >= currentTime &&
            reservationEndTime <= range
          );
        });
        return !hasReservations ? room : null;
      }));
      setRooms(filteredRooms.filter(room => room !== null));
    } catch (error) {
      setTitle("No Available Rooms");
      console.error("Error getting available rooms:", error);
    }
  }

  const getAvailableRoomsInFiveHours = async () => {
    const fiveHoursFromNow = new Date(currentTime.getTime() + 5 * 60 * 60 * 1000);
    getAvailableRooms(fiveHoursFromNow);
    setTitle("All Available Rooms in 5 hours");
  }

  const getAvailableRoomsInOneDay = async () => {
    const oneDayFromNow = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);
    getAvailableRooms(oneDayFromNow);
    setTitle("All Available Rooms in 1 day");
  }

  return (
    <div className="w-full mx-auto bg-white">
      <NavBar />
      <Grid container spacing={2} className="justify-center">
        <Grid item xs={12} className="text-left">
          <Button onClick={getAvailableRoomsInFiveHours}>Available in 5 hours</Button>
          <Button onClick={getAvailableRoomsInOneDay}>Available in 1 day</Button>
        </Grid>
        <Grid item xs={12} className="text-center">
          <h1 className="text-4xl font-bold">{title}</h1>
        </Grid>
        <Grid item className="text-center ">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {rooms.map((room) => (
              <Card
                key={room.id}
                style={{ minWidth: "200px", maxWidth: "300px" }}
                className="m-2 p-2"
              >
                <CardMedia
                  sx={{ height: 140 }}
                  image="/static/images/cards/contemplative-reptile.jpg"
                  title="green iguana"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {room.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {room.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Share</Button>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            ))}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default HomepageComponent;
