import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Skeleton,
} from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Room } from '../types/room.type';
import { RoomService } from '../services/room.service';
import { HotelService } from '../services/hotel.service';
import { ReservationService } from '../services/reservation.service';
import { Hotel } from '../types/hotel.type';
import { Reservation } from '../types/reservation.type';
import Sidebar from '../components/sidebar/Sidebar';
import { AddReservationDialog } from '../components/reservations/AddReservationDialog';
import './calendar.css';
import { purple } from '@mui/material/colors';

interface SelectionInfo {
  startStr: string;
  endStr: string;
  resource?: {
    id: string;
    title: string;
  };
}

const CalendarPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState<SelectionInfo | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('blue.800', 'blue.100');
  const boxBgColor = useColorModeValue('white', 'gray.800');
  const toast = useToast();

  // Helper function to get color based on reservation status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return '#4CAF50'; // green
      case 'PENDING':
        return '#FFC107'; // yellow
      case 'CANCELLED':
        return '#F44336'; // red
      case 'CHECKED_IN':
        return '#2196F3'; // blue
      case 'CHECKED_OUT':
        return '#9E9E9E'; // dark gray
      default:
        return '#4299E1'; // blue
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const hotel = await HotelService.getCurrentUserHotel();
      if (!hotel || !hotel.id) {
        toast({
          title: 'Error',
          description: 'No hotel assigned to user',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }

      setCurrentHotel(hotel);
      const [roomsData, reservationsData] = await Promise.all([
        RoomService.getRoomsByHotel(hotel.id),
        ReservationService.getReservationsByHotel(hotel.id)
      ]);
      
      setRooms(roomsData);
      setReservations(reservationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (selectInfo: any) => {
    const room = rooms.find(r => r.id?.toString() === selectInfo.resource.id);
    if (room) {
      setSelectedRoom(room);
      setSelection({
        startStr: selectInfo.startStr,
        endStr: selectInfo.endStr,
        resource: selectInfo.resource
      });
      setIsReservationDialogOpen(true);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const reservationId = clickInfo.event.id;
    const reservation = reservations.find(r => r.id?.toString() === reservationId);
    if (reservation) {
      setSelectedRoom(reservation.room);
      setSelectedReservation(reservation);
      setIsReservationDialogOpen(true);
    }
  };

  const handleReservationAdded = () => {
    fetchRooms(); // This will now fetch both rooms and reservations
  };

  // Convert rooms to calendar resources
  const resources = rooms.map(room => ({
    id: room.id?.toString() || '',
    title: `${room.number} - ${room.name}`,
    eventColor: room.status === 'AVAILABLE' ? '#48BB78' : '#F56565'
  }));

  // Convert reservations to calendar events
  const events = reservations.map(reservation => ({
    id: reservation.id?.toString(),
    resourceId: reservation.room.id?.toString(),
    title: `${reservation.guest?.firstName || 'Guest'} ${reservation.guest?.lastName || ''}`,
    start: reservation.checkInTime,
    end: reservation.checkOutTime,
    status: reservation.status,
    backgroundColor: getStatusColor(reservation.status)
  }));

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Container maxW="container.xl" py={5}>
          {/* Header */}
          <Box mb={6}>
            <Heading size="lg" mb={2} color={headingColor}>
              Room Calendar
            </Heading>
            <Text color={textColor}>
              View and manage room reservations
            </Text>
          </Box>

          {/* Calendar */}
          {loading ? (
            <Skeleton height="700px" />
          ) : (
            <Box
              bg={boxBgColor}
              p={4}
              borderRadius="lg"
              shadow="md"
              overflow="hidden"
            >
              <FullCalendar
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  resourceTimeGridPlugin,
                  interactionPlugin
                ]}
                initialView="resourceTimeGridDay"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,resourceTimeGridWeek,resourceTimeGridDay'
                }}
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
                resources={resources}
                events={events}
                slotMinTime="00:00:00"
                slotMaxTime="24:00:00"
                allDaySlot={false}
                slotDuration="01:00:00"
                height="calc(100vh - 220px)"
                eventOverlap={false}
                selectable={true}
                selectMirror={true}
                selectMinDistance={2}
                dayMaxEvents={true}
                weekends={true}
                nowIndicator={true}
                editable={true}
                droppable={true}
                select={handleSelect}
                eventClick={handleEventClick}
                selectOverlap={false}
                unselectAuto={false}
                slotEventOverlap={false}
                selectConstraint={{
                  startTime: '00:00',
                  endTime: '24:00'
                }}
              />
            </Box>
          )}

          {/* Reservation Dialog */}
          {((selectedRoom && currentHotel && selection) || selectedReservation) && (
            <AddReservationDialog
              isOpen={isReservationDialogOpen}
              onClose={() => {
                setIsReservationDialogOpen(false);
                setSelectedReservation(null);
                setSelectedRoom(null);
                setSelection(null);
              }}
              onReservationAdded={handleReservationAdded}
              selectedRoom={selectedRoom || selectedReservation?.room!}
              selectedStartTime={selection?.startStr || selectedReservation?.checkInTime || ''}
              selectedEndTime={selection?.endStr || selectedReservation?.checkOutTime || ''}
              hotel={currentHotel || selectedReservation?.hotel!}
              existingReservation={selectedReservation || undefined}
            />
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default CalendarPage;
