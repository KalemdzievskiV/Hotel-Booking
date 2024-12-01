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
import RoomDetailsComponent from "../Room/RoomDetailsComponent";
import DashboardComponent from "../Dashboard/DashboardComponent";
import Home from "../Home";

const AppRoutes = () => {
    return <>
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginComponent/>}/>
                <Route path="/signup" element={<SignupComponent/>}/>
                <Route path="/home" element={<Home/>}/>
                
                {/* Protected routes */}
                <Route path="/" element={<HomepageComponent/>}/>
                <Route path="/dashboard" element={<DashboardComponent/>}/>
                <Route path="/calendar" element={<CalendarComponent/>}/>
                <Route path="/user" element={<UserComponent/>}/>
                <Route path="/room" element={<RoomComponent/>}/>
                <Route path="/reservation" element={<ReservationComponent/>}/>
                <Route path="/new-calendar" element={<TimelineCalendar/>}/>
                <Route path="/room/:id" element={<RoomDetailsComponent/>}/>
            </Routes>
        </Router>
    </>;
};

export default AppRoutes;
