import './App.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from "moment";


const localizer = momentLocalizer(moment);

const events = [
  {
    start: moment("2023-03-18T10:00:00").toDate(),
    end: moment("2023-03-18T11:00:00").toDate(),
    title: "MRI Registration",
  },
  {
    start: moment("2023-03-18T14:00:00").toDate(),
    end: moment("2023-03-18T15:30:00").toDate(),
    title: "ENT Appointment",
  },
];

function App() {
  return (
    <div className="App">
      <Calendar localizer={localizer} events={events}></Calendar>
    </div>
  );
}

export default App;
