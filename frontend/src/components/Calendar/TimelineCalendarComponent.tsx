import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  styled,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import NewNavBar from '../Layout/NewNavBar';
import RoomService from '../../services/RoomService';
import ReservationService from '../../services/ReservationService';
import AddReservationComponent from '../Reservation/AddReservationComponent';
import { Room } from "../../types/room.type";

type ViewType = 'day' | 'week' | 'twoWeeks';

interface TimeSlot {
  start: string;
  end: string;
}

interface TimeSelection {
  roomId: number;
  startSlot: number;
  endSlot: number;
  date: Date;
}

// Types for our reservations
interface Reservation {
  id: number;
  start: string;
  finish: string;
  status: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  };
  room: {
    id: number;
    number: string;
    name: string;
  };
}

// Styled components
const TimelineContainer = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  overflowY: 'hidden',
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: theme.shape.borderRadius,
}));

const ReservationBlock = styled(Paper)<{ status: string }>(({ theme, status }) => ({
  position: 'absolute',
  height: '80%',
  top: '10%',
  borderRadius: '4px',
  padding: theme.spacing(1),
  cursor: 'pointer',
  backgroundColor: status === 'confirmed' ? '#4caf50' : status === 'pending' ? '#ff9800' : '#2196f3',
  color: '#fff',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
    zIndex: 1,
  },
}));

const MainContent = styled(Box)({
  flex: 1,
  height: '100vh',
  overflow: 'auto',
});

const TimeSlotCell = styled(Box)({
  width: '32px',
  height: '100%',
  borderRight: '1px solid #f0f0f0',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
  },
});

const TimelineCalendarComponent: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('day');
  const [dates, setDates] = useState<Date[]>([new Date()]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ roomId: number; slotIndex: number } | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<TimeSelection | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, reservationsData] = await Promise.all([
          RoomService.getRoomList(),
          ReservationService.getReservationList(),
        ]);
        console.log('Current Date:', currentDate.toLocaleString());
        console.log('Rooms:', roomsData);
        console.log('Reservations:', reservationsData);
        setRooms(roomsData);
        setReservations(reservationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [currentDate]);

  useEffect(() => {
    updateDatesForView();
  }, [currentDate, view]);

  const updateDatesForView = () => {
    const newDates = [];
    const startDate = new Date(currentDate);
    
    if (view === 'day') {
      newDates.push(new Date(startDate));
    } else {
      const daysToShow = view === 'week' ? 7 : 14;
      startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
      
      for (let i = 0; i < daysToShow; i++) {
        newDates.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
      }
    }
    
    setDates(newDates);
  };

  // Generate time slots for the day (30-minute intervals)
  const timeSlots: TimeSlot[] = Array.from({ length: 48 }, (_, index) => {
    const hour = Math.floor(index / 2);
    const minute = (index % 2) * 30;
    const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const endHour = minute === 30 ? hour + 1 : hour;
    const endMinute = minute === 30 ? 0 : 30;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    return { start: startTime, end: endTime };
  });

  // Create a function to set time for a date
  const setDateTime = (date: Date, hours: number, minutes: number): Date => {
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };

  // Create base date for today
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 14);
    }
    setCurrentDate(newDate);
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 14);
    }
    setCurrentDate(newDate);
  };

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: ViewType | null,
  ) => {
    if (newView) {
      setView(newView);
    }
  };

  // Calculate position and width for reservation blocks
  const getReservationStyle = (reservation: Reservation) => {
    const startDate = dates[0];
    const totalDays = dates.length;
    const dayWidth = 100 / totalDays;

    const start = Math.max(
      0,
      (new Date(reservation.start).getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)
    );
    const duration = Math.min(
      totalDays - start,
      (new Date(reservation.finish).getTime() - new Date(reservation.start).getTime()) / (24 * 60 * 60 * 1000)
    );

    return {
      left: `${start * dayWidth}%`,
      width: `${duration * dayWidth}%`,
    };
  };

  const getDateRangeText = () => {
    if (view === 'day') {
      return dates[0].toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
    return `${dates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - 
           ${dates[dates.length - 1].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  };

  const handleMouseDown = (roomId: number, slotIndex: number) => {
    console.log('Mouse Down:', { roomId, slotIndex });
    setIsDragging(true);
    setDragStart({ roomId, slotIndex });
    setSelectedSlots({
      roomId,
      startSlot: slotIndex,
      endSlot: slotIndex,
      date: dates[0]
    });
  };

  const handleMouseEnter = (roomId: number, slotIndex: number) => {
    if (isDragging && dragStart && dragStart.roomId === roomId) {
      console.log('Mouse Enter:', { roomId, slotIndex, isDragging });
      setSelectedSlots(prev => {
        if (!prev) return null;
        const newSelection = {
          ...prev,
          startSlot: Math.min(dragStart.slotIndex, slotIndex),
          endSlot: Math.max(dragStart.slotIndex, slotIndex)
        };
        console.log('Updated Selection:', newSelection);
        return newSelection;
      });
    }
  };

  const handleMouseUp = () => {
    console.log('Mouse Up Event', { isDragging, selectedSlots });
    if (selectedSlots) {
      const startTime = new Date(selectedSlots.date);
      const endTime = new Date(selectedSlots.date);
      
      const startHour = Math.floor(selectedSlots.startSlot / 2);
      const startMinute = (selectedSlots.startSlot % 2) * 30;
      const endHour = Math.floor(selectedSlots.endSlot / 2);
      const endMinute = (selectedSlots.endSlot % 2) * 30;
      
      startTime.setHours(startHour, startMinute, 0, 0);
      
      // If ending at midnight (00:00), set to 23:59:59.999 of previous slot
      if (endHour === 0 && endMinute === 0) {
        endTime.setHours(23, 59, 59, 999);
      } else {
        // Otherwise set to 59.999 seconds of the current minute
        endTime.setHours(endHour, endMinute + 29, 59, 999);
      }

      console.log('Selected Time Slot Information:', {
        roomNumber: rooms.find(r => r.id === selectedSlots.roomId)?.number,
        startTime: startTime.toLocaleTimeString(),
        endTime: endTime.toLocaleTimeString(),
        date: startTime.toLocaleDateString(),
      });

      setIsDialogOpen(true);
    }
    setIsDragging(false);
    setDragStart(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedSlots(null);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const getReservationColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return '#4CAF50'; // Green
      case 'booked':
        return '#FFA726'; // Orange
      case 'cancelled':
        return '#EF5350'; // Red
      case 'active':
        return '#42A5F5'; // Blue
      case 'completed':
        return '#78909C'; // Grey
      default:
        return '#9C27B0'; // Purple for unknown status
    }
  };

  const getFilteredReservations = (room: Room, date: Date) => {
    return reservations.filter(reservation => {
      if (!reservation || !reservation.room || !reservation.user) return false;
      
      const reservationDate = new Date(reservation.start);
      return (
        reservationDate.getFullYear() === date.getFullYear() &&
        reservationDate.getMonth() === date.getMonth() &&
        reservationDate.getDate() === date.getDate() &&
        reservation.room.id === room.id
      );
    });
  };

  const handleReservationClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsReservationDialogOpen(true);
  };

  const handleCloseReservationDialog = () => {
    setIsReservationDialogOpen(false);
    setSelectedReservation(null);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <NewNavBar />
      <MainContent>
        <Paper elevation={3} sx={{ mt: 3, ml: 2, p: 2, width: 'calc(100vw - 200px)', minWidth: '1200px' }}>
          {/* Calendar Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={handlePrevDay}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6">
                {currentDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
              <IconButton onClick={handleNextDay}>
                <ChevronRightIcon />
              </IconButton>
              <Button variant="outlined" onClick={handleTodayClick}>
                Today
              </Button>
            </Box>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(e, newView) => newView && setView(newView)}
            >
              <ToggleButton value="day">Day</ToggleButton>
              <ToggleButton value="week">Week</ToggleButton>
              <ToggleButton value="twoWeeks">2 Weeks</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Timeline Grid */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <TimelineContainer>
              <Box sx={{ 
                display: 'flex', 
                borderBottom: '2px solid #e0e0e0', 
                position: 'sticky', 
                top: 0, 
                backgroundColor: '#fff', 
                zIndex: 1 
              }}>
                {/* Room column header */}
                <Box sx={{ 
                  width: '120px',
                  minWidth: '120px',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: 'background.paper',
                  zIndex: 2,
                  p: 1,
                  borderRight: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="subtitle2">
                    Room
                  </Typography>
                </Box>
                
                {/* Time slots header for day view */}
                {view === 'day' ? (
                  <Box sx={{ display: 'flex', flex: 1, minWidth: '1536px' }}> 
                    {timeSlots.map((timeSlot, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: '32px',
                          minWidth: '32px',
                          borderRight: '1px solid #e0f0f0',
                          p: 1,
                          textAlign: 'center',
                          backgroundColor: index % 2 === 0 ? 'inherit' : 'rgba(0, 0, 0, 0.02)',
                        }}
                      >
                        <Typography variant="caption" display="block" sx={{ 
                          transform: 'rotate(-45deg)', 
                          transformOrigin: '50% 50%', 
                          whiteSpace: 'nowrap', 
                          marginTop: '10px',
                          marginLeft: '-5px' 
                        }}>
                          {timeSlot.start}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  /* Date headers for week/two-weeks view */
                  dates.map((date, index) => (
                    <Box
                      key={date.toISOString()}
                      sx={{
                        flex: 1,
                        minWidth: '100px',
                        borderRight: '1px solid #e0e0e0',
                        p: 1,
                        textAlign: 'center',
                        backgroundColor: date.getDay() === 0 || date.getDay() === 6 ? '#f5f5f5' : 'inherit',
                      }}
                    >
                      <Typography variant="caption" display="block">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </Typography>
                      <Typography variant="body2">
                        {date.getDate()}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>

              {/* Room rows */}
              <Box sx={{ position: 'relative', borderTop: '1px solid #e0e0e0' }}>
                {rooms.map((room) => {
                  if (!room) return null;
                  return (
                    <Box
                      key={room.id}
                      sx={{
                        display: 'flex',
                        borderBottom: '1px solid #e0e0e0',
                        height: '80px',
                        position: 'relative',
                      }}
                    >
                      {/* Room info */}
                      <Box sx={{ 
                        width: '120px',
                        minWidth: '120px',
                        position: 'sticky',
                        left: 0,
                        backgroundColor: 'background.paper',
                        zIndex: 2,
                        p: 1,
                        borderRight: '1px solid #e0e0e0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 0.5
                      }}>
                        <Typography variant="subtitle2">
                          Room {room.number}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {room.name}
                        </Typography>
                      </Box>

                      {/* Timeline cell */}
                      {view === 'day' ? (
                        <Box 
                          sx={{ 
                            display: 'flex',
                            flex: 1,
                            minWidth: '1536px',
                            height: '100%',
                            position: 'relative',
                            backgroundColor: 'background.paper'
                          }}
                          onMouseUp={handleMouseUp}
                        >
                          {timeSlots.map((timeSlot, index) => (
                            <TimeSlotCell
                              key={index}
                              onMouseDown={(e) => {
                                e.preventDefault(); // Prevent text selection
                                handleMouseDown(room.id, index);
                              }}
                              onMouseEnter={() => handleMouseEnter(room.id, index)}
                              sx={{
                                backgroundColor: selectedSlots && 
                                               selectedSlots.roomId === room.id && 
                                               index >= selectedSlots.startSlot && 
                                               index <= selectedSlots.endSlot
                                  ? 'rgba(25, 118, 210, 0.2)'
                                  : index % 2 === 0 ? 'inherit' : 'rgba(0, 0, 0, 0.02)',
                                cursor: 'pointer',
                                userSelect: 'none',
                              }}
                            />
                          ))}
                          
                          {/* Render Reservations */}
                          {getFilteredReservations(room, currentDate)
                            .map((reservation) => {
                              if (!reservation || !reservation.user) return null;
                              
                              const startTime = new Date(reservation.start);
                              const endTime = new Date(reservation.finish);
                              
                              // Calculate slots including fractional parts
                              const startHour = startTime.getHours();
                              const startMinute = startTime.getMinutes();
                              const startSlot = startHour * 2 + (startMinute / 30);
                              
                              const endHour = endTime.getHours();
                              const endMinute = endTime.getMinutes();
                              const endSlot = endHour * 2 + (endMinute / 30);
                              
                              // Each time slot is 32px wide
                              const slotWidth = 32;
                              const left = startSlot * slotWidth;
                              const width = (endSlot - startSlot) * slotWidth;
                              
                              return (
                                <Box
                                  key={reservation.id}
                                  sx={{
                                    position: 'absolute',
                                    left: `${left}px`,
                                    width: `${width}px`,
                                    height: '70%',
                                    top: '15%',
                                    backgroundColor: getReservationColor(reservation.status),
                                    borderRadius: '4px',
                                    color: 'white',
                                    padding: '4px',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    zIndex: 1,
                                    '&:hover': {
                                      opacity: 0.9,
                                      cursor: 'pointer',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    },
                                  }}
                                  title={`${reservation.user.firstName || 'Unknown'} - ${startTime.toLocaleTimeString()} to ${endTime.toLocaleTimeString()} (${reservation.status})`}
                                  onClick={() => handleReservationClick(reservation)}
                                >
                                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="caption" sx={{ fontSize: 'inherit' }}>
                                      {reservation.user.firstName || 'Unknown'} {reservation.user.lastName || 'Unknown'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontSize: 'inherit', opacity: 0.8 }}>
                                    ({startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                                    </Typography>
                                  </Box>
                                </Box>
                              );
                            })}
                        </Box>
                      ) : (
                        <Box sx={{ 
                          flex: 1,
                          position: 'relative',
                          display: 'flex',
                          minWidth: `${100 * dates.length}px`,
                        }}>
                          {/* Date cells background */}
                          {dates.map((date, index) => (
                            <Box
                              key={date.toISOString()}
                              sx={{
                                flex: 1,
                                borderRight: '1px solid #e0e0e0',
                                backgroundColor: date.getDay() === 0 || date.getDay() === 6 ? '#f5f5f5' : 'inherit',
                              }}
                            />
                          ))}

                          {/* Reservations for week/two-weeks view */}
                          {reservations
                            .filter((res) => res && res.room && res.user && res.room.id === room.id)
                            .map((reservation) => (
                              <Tooltip
                                key={reservation.id}
                                title={`${reservation.user.firstName || 'Unknown'} (${reservation.finish})`}
                              >
                                <ReservationBlock
                                  status={'confirmed'}
                                  sx={getReservationStyle(reservation)}
                                  onClick={() => handleReservationClick(reservation)}
                                >
                                  {reservation.user.firstName || 'Unknown'}
                                </ReservationBlock>
                              </Tooltip>
                            ))}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </TimelineContainer>
          </Box>
        </Paper>

        {/* Time Selection Dialog */}
        <Dialog 
          open={isDialogOpen} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          {selectedSlots && (
            <AddReservationComponent
              onClose={handleCloseDialog}
              start={(() => {
                const date = new Date(selectedSlots.date);
                const startHour = Math.floor(selectedSlots.startSlot / 2);
                const startMinute = (selectedSlots.startSlot % 2) * 30;
                date.setHours(startHour, startMinute, 0, 0);
                return date;
              })()}
              end={(() => {
                const date = new Date(selectedSlots.date);
                const endHour = Math.floor(selectedSlots.endSlot / 2);
                const endMinute = (selectedSlots.endSlot % 2) * 30;
                date.setHours(endHour, endMinute + 30, 0, 0);
                return date;
              })()}
              selectedRoom={rooms.find(r => r.id === selectedSlots.roomId) as Room | undefined}
            />
          )}
        </Dialog>

        {/* Reservation Details Dialog */}
        <Dialog
          open={isReservationDialogOpen}
          onClose={handleCloseReservationDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Reservation Details
          </DialogTitle>
          <DialogContent>
            {selectedReservation && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Guest:</strong> {selectedReservation.user.firstName} {selectedReservation.user.lastName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Room:</strong> {selectedReservation.room.name} (#{selectedReservation.room.number})
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Check-in:</strong> {formatDateTime(selectedReservation.start)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Check-out:</strong> {formatDateTime(selectedReservation.finish)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Status:</strong>{' '}
                  <Box
                    component="span"
                    sx={{
                      color: selectedReservation.status === 'confirmed' ? 'success.main' :
                             selectedReservation.status === 'pending' ? 'warning.main' : 'info.main',
                      textTransform: 'capitalize'
                    }}
                  >
                    {selectedReservation.status}
                  </Box>
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReservationDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </MainContent>
    </Box>
  );
};

export default TimelineCalendarComponent;
