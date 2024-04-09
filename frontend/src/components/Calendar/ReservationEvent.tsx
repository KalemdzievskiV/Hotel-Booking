import { Box, Typography } from "@mui/material";
import { Reservation } from "../../types/reservation.type";
import ReservationStatus from "../../enum/reservation/reservation.status.enum";

export default function AppointmentEvent({
  appointment,
  isMonthView,
}: {
  appointment: Reservation;
  isMonthView?: boolean;
}) {
  const { start, finish, status } = appointment;
  const background = appointment.status === ReservationStatus.ACTIVE ? "green" : "red";

  return (
    <Box
        p={2}
        borderRadius={4}
        bgcolor={background}
        color="white"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height={isMonthView ? 100 : 150}
    >
    <Typography alignItems={"center"} justifyContent="space-between">
        <Typography>
                <Typography fontSize="xs">{start.toString()}</Typography>
        </Typography>
        <Typography>
            <Typography fontSize="xs">{finish.toString()}</Typography>
        </Typography>
    </Typography>
        <Typography>
            <Typography fontSize="xs">{status}</Typography>
        </Typography>
    </Box>
  );
}