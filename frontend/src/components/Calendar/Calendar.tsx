import {
    Calendar as BigCalendar,
    CalendarProps,
    momentLocalizer,
  } from "react-big-calendar";
  import moment from "moment";
  import 'react-big-calendar/lib/css/react-big-calendar.css';
  
  const localizer = momentLocalizer(moment);
  
  export default function Calendar(props: Omit<CalendarProps, "localizer">) {
    return <BigCalendar {...props} localizer={localizer} />;
  }
  