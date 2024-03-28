import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import React from "react";
import CalendarComponent from "../Calendar/CalednarComponent";
import HomepageComponent from "../HomepageComponent";
import UserComponent from "../User/UserComponent";
import RoomComponent from "../Room/RoomComponent";
import ReservationComponent from "../Reservation/ReservationComponent";

const AppRoutes = () => {
    return <>
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomepageComponent/>}/>
                <Route path="/calendar" element={<CalendarComponent/>}/>
                <Route path="/user" element={<UserComponent/>}/>
                <Route path="/room" element={<RoomComponent/>}/>
                <Route path="/reservation" element={<ReservationComponent/>}/>
            </Routes>
        </Router>
    </>;
};

export default AppRoutes;
