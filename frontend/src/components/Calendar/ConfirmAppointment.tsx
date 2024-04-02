import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import dayjs from "dayjs";

interface ConfirmAppointmentProps {
  start: Date;
  end: Date;
  onSave: (confirmed: boolean) => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmAppointment: React.FC<ConfirmAppointmentProps> = ({
  start,
  end,
  onSave,
}) => {
  const [open, setOpen] = React.useState(true);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="confirm-appointment">
      <React.Fragment>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          onBackdropClick={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Request appointment"}</DialogTitle>
          <DialogContent sx={{overflowY: "unset"}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker value={dayjs(start)} label="Start" />
              <TimePicker value={dayjs(end)} label="End" />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onSave(false)}>Close</Button>
            <Button onClick={() => onSave(true)}>Agree</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

// Utility function to format date
function formatDate(date: Date): string {
  return date.toLocaleString(); // Adjust this according to your desired date format
}

export default ConfirmAppointment;
