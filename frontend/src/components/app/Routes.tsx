import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import React from "react";
import CalendarComponent from "../Calendar/CalendarComponent";
import HomepageComponent from "../HomepageComponent";
import UserComponent from "../User/UserComponent";
import RoomComponent from "../Room/RoomComponent";
import ReservationComponent from "../Reservation/ReservationComponent";
import TimelineCalendar from "../Calendar/TimelineCalendarComponent";
import LoginComponent from "../User/LoginComponent";
import SignupComponent from "../User/SignupComponent";

const AppRoutes = () => {
    return <>
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginComponent/>}/>
                <Route path="/signup" element={<SignupComponent/>}/>
                
                {/* Protected routes */}
                <Route path="/" element={<HomepageComponent/>}/>
                <Route path="/calendar" element={<CalendarComponent/>}/>
                <Route path="/user" element={<UserComponent/>}/>
                <Route path="/room" element={<RoomComponent/>}/>
                <Route path="/reservation" element={<ReservationComponent/>}/>
                <Route path="/new-calendar" element={<TimelineCalendar/>}/>
            </Routes>
        </Router>
    </>;
};

export default AppRoutes;
