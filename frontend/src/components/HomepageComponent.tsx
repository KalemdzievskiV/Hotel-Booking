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
  Container,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Room } from "../types/room.type";
import RoomService from "../services/RoomService";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";
import testImage from '../assets/test.jpeg';

function HomepageComponent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [title, setTitle] = useState<string>("All Available Rooms");
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  useEffect(() => {
    getAvailableRooms();
  }, []);

  const getAvailableRooms = async () => {
    try {
      RoomService.getAvailableRooms().then((data) => {
        setRooms(data);
      });
    } catch (error) {
      setTitle("No Available Rooms");
      console.error("Error getting available rooms:", error);
    }
  };

  const getAvailableRoomsCustom = async (selectedTime: Date) => {
    RoomService.getAvailableRoomsInDateRange(
      new Date(
        dayjs(selectedTime.getTime()).format("YYYY-MM-DDTHH:mm:ss+00:00")
      ).toJSON()
    ).then((data) => {
      setRooms(data);
    });
    setTitle(
      "All Available Rooms in 5 hours from " +
        dayjs(selectedTime).format("MMM-DD HH:mm")
    );
  };

  const getAvailableRoomsInFiveHours = async () => {
    RoomService.getAvailableRoomsInFiveHours().then((data) => {
      setRooms(data);
    });
    setTitle("All Available Rooms in 5 hours");
  };

  const getAvailableRoomsInOneDay = async () => {
    RoomService.getAvailableRoomsInOneDay().then((data) => {
      setRooms(data);
    });
    setTitle("All Available Rooms in 1 day");
  };

  const redirectToCalendar = (roomId: number) => {
    window.location.href = `/calendar?roomId=${roomId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <Container maxWidth="lg" className="py-8">
        <Grid container spacing={3}>
          {/* Filter Controls - Made more compact */}
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: "12px",
                maxWidth: "1100px", // Limit max width
                margin: "0 auto", // Center the card
              }}
            >
              <div className="flex justify-between items-center p-3">
                {" "}
                {/* Reduced padding */}
                {/* First row: Filter buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    onClick={getAvailableRoomsInFiveHours}
                    sx={{
                      borderRadius: "8px",
                      borderColor: "#e5e7eb",
                      color: "#374151",
                      backgroundColor: "white",
                      "&:hover": {
                        backgroundColor: "#f9fafb",
                        borderColor: "#d1d5db",
                      },
                      height: "40px", // Reduced height
                    }}
                  >
                    Available in 5 hours
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={getAvailableRoomsInOneDay}
                    sx={{
                      borderRadius: "8px",
                      borderColor: "#e5e7eb",
                      color: "#374151",
                      backgroundColor: "white",
                      "&:hover": {
                        backgroundColor: "#f9fafb",
                        borderColor: "#d1d5db",
                      },
                      height: "40px", // Reduced height
                    }}
                  >
                    Available in 1 day
                  </Button>
                </div>
                {/* Right side: Date picker and search */}
                <div className="flex items-center gap-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      value={dayjs(selectedTime)}
                      onChange={(value) => setSelectedTime(value?.toDate()!)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: "white",
                          height: "40px", // Reduced height
                          "& fieldset": {
                            borderColor: "#e5e7eb",
                          },
                          "&:hover fieldset": {
                            borderColor: "#d1d5db",
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>

                  <Button
                    variant="contained"
                    onClick={() => getAvailableRoomsCustom(selectedTime)}
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#2563eb",
                      "&:hover": {
                        backgroundColor: "#1d4ed8",
                      },
                      textTransform: "none",
                      boxShadow: "none",
                      padding: "8px 16px",
                      height: "40px", // Reduced height
                    }}
                  >
                    Search Available Rooms
                  </Button>
                </div>
              </div>
            </Card>
          </Grid>

          {/* Title */}
          <Grid item xs={12}>
            <Typography
              variant="h4"
              component="h1"
              className="font-bold text-gray-800 mb-6"
              sx={{ textAlign: "center" }}
            >
              {title}
            </Typography>
          </Grid>

          {/* Room Cards - Wider layout */}
          <Grid item xs={12}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {" "}
              {/* Changed to 2 columns */}
              {rooms.map((room) => (
                <Card
                  key={room.id}
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    minWidth: "250px",
                    maxWidth: "800px", // Increased width
                    margin: "0 auto",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                    "&:hover": {
                      boxShadow: "0 4px 6px rgba(0,0,0,0.08)",
                    },
                    transition: "box-shadow 0.3s ease-in-out",
                  }}
                >
                  <CardMedia
                    sx={{
                      height: 280,
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                    }}
                    image={testImage}
                    title={`Room ${room.number}`}
                  />
                  <CardContent sx={{ padding: "16px" }}>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        fontWeight: 500,
                        fontSize: "1.25rem",
                        marginBottom: "8px",
                      }}
                    >
                      Room {room.number}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "rgb(95, 99, 104)",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {room.description}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      padding: "8px 16px 16px",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      sx={{
                        textTransform: "none",
                        color: "#1a73e8",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        border: "1px solid #1a73e8",
                        borderRadius: "4px",
                        padding: "6px 16px",
                        "&:hover": {
                          background: "none",
                          color: "#174ea6",
                          borderColor: "#174ea6",
                        },
                      }}
                      onClick={() => redirectToCalendar(room.id)}
                    >
                      Book Appointment
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default HomepageComponent;
