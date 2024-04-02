import { useState } from "react";
import Calendar from "./Calendar";
import moment from "moment";
import { SlotInfo } from "react-big-calendar";
import ConfirmAppointment from "./ConfirmAppointment";

export default function CalendarViewComponent() {
    type BigCalendarEvent = {
        title: string;
        start: Date;
        end: Date;
        allDay?: boolean;
        resource?: any;
      };
    const myEvents: BigCalendarEvent[] = [
        {
          start: moment("2024-02-10T12:00:00").toDate(),
          end: moment("2024-02-10T13:00:00").toDate(),
          title: ""
        },
        {
          start: moment("2024-02-10T15:00:00").toDate(),
          end: moment("2024-02-10T17:00:00").toDate(),
          title: ""
        },
        {
          start: moment("2024-02-05T12:00:00").toDate(),
          end: moment("2024-02-05T17:00:00").toDate(),
          title: ""
        }
      ];
    const [events, setEvents] = useState(myEvents);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date, end: Date } | null>(null);
    
    const handleSelectSlot = ({ start, end }: SlotInfo) => {
        setSelectedSlot({ start, end });
        setShowConfirm(true);
        console.log("slot select: ", start, end);
    };

    const handleConfirmAppointment = (confirmed: boolean) => {
        setShowConfirm(false);
        if (confirmed && selectedSlot) {
            // Handle saving the appointment here
            console.log('Appointment saved:', selectedSlot.start, 'to', selectedSlot.end);
        }
        setSelectedSlot(null);
    };

    return (
        <div>
        <Calendar
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
      />
      {showConfirm && selectedSlot &&(
        <ConfirmAppointment
        start={selectedSlot?.start}
        end={selectedSlot?.end}
        onSave={handleConfirmAppointment}
        
    />
      )}
    </div>
    );
    }