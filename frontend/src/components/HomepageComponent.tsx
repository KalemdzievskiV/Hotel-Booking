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

function HomepageComponent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    RoomService.getRoomByStatus(RoomStatus.AVAILABLE).then((data) =>
      setRooms(data)
    );
  }, []);
  return (
    <div className="w-full mx-auto bg-white">
      <NavBar />
      <Grid container spacing={2} className="justify-center">
        <Grid item xs={12} className="text-center">
          <h1 className="text-4xl font-bold">Available Rooms</h1>
        </Grid>
        <Grid item className="text-center ">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {rooms.map((room) => (
            <Card key={room.id} style={{ minWidth: '200px', maxWidth: '300px' }} className="m-2 p-2">
              <CardMedia
                sx={{ height: 140 }}
                image="/static/images/cards/contemplative-reptile.jpg"
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Lizard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lizards are a widespread group of squamate reptiles, with over
                  6,000 species, ranging across all continents except Antarctica
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
