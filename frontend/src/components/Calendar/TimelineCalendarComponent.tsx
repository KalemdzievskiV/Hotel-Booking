import React, { useState } from 'react';
import NavBar from '../Layout/NavBar';
import { 
  Box, 
  Paper, 
  Grid,
  Typography,
  IconButton,
  Badge,
  styled,
  InputAdornment,
  Avatar,
  TextField,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import HomeIcon from '@mui/icons-material/Home';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WeekendIcon from '@mui/icons-material/Weekend';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PaymentsIcon from '@mui/icons-material/Payments';
import NewNavBar from '../Layout/NewNavBar';

// Styled components for calendar
const CalendarDay = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));

const NavItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&.active': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    color: '#1976d2',
  },
}));

const Navbar: React.FC = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh'
    }}>
      {/* Left Sidebar */}
      <Box sx={{ 
        width: '240px', 
        borderRight: '1px solid #e0e0e0',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {/* Logo */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box 
            component="img" 
            src="/novotel-logo.png" 
            alt="Novotel" 
            sx={{ height: 32 }}
          />
          <Typography variant="h6" sx={{ color: '#1976d2' }}>
            Novotel
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <NavItem>
            <HomeIcon />
            <Typography>Dashboard</Typography>
          </NavItem>
          <NavItem className="active">
            <EditNoteIcon />
            <Typography>Front desk</Typography>
          </NavItem>
          <NavItem>
            <PersonOutlineIcon />
            <Typography>Guests</Typography>
          </NavItem>
          <NavItem>
            <WeekendIcon />
            <Typography>Rooms</Typography>
          </NavItem>
          <NavItem>
            <LocalOfferIcon />
            <Typography>Deals</Typography>
          </NavItem>
          <NavItem>
            <PaymentsIcon />
            <Typography>Rate</Typography>
          </NavItem>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1 }}>
        {/* Top Navigation Bar */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid #e0e0e0'
        }}>
          {/* Global Search */}
          <TextField
            placeholder="Search for rooms and offers"
            variant="outlined"
            size="small"
            sx={{ 
              width: '300px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f5f5f5',
                '& fieldset': {
                  border: 'none',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#757575' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Right Side Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton>
              <NotificationsNoneIcon />
            </IconButton>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                cursor: 'pointer'
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const NewCalendarComponent: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get calendar data
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  return (
    <Box>
      <NewNavBar />
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          {/* Calendar Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
            <IconButton onClick={handlePrevMonth}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h5">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Typography>
            <IconButton onClick={handleNextMonth}>
              <ChevronRightIcon />
            </IconButton>
          </Box>

          {/* Weekday Headers */}
          <Grid container spacing={1}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid item xs key={day}>
                <Typography align="center" sx={{ fontWeight: 'bold' }}>
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Grid */}
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {[...Array(firstDayOfMonth)].map((_, index) => (
              <Grid item xs key={`empty-${index}`}>
                <CalendarDay sx={{ visibility: 'hidden' }} />
              </Grid>
            ))}
            
            {[...Array(daysInMonth)].map((_, index) => (
              <Grid item xs key={index}>
                <CalendarDay>
                  <Typography sx={{ mb: 1 }}>{index + 1}</Typography>
                  {/* Example room status indicator */}
                  <Badge 
                    color="primary" 
                    badgeContent={Math.floor(Math.random() * 5)} 
                    max={99}
                  >
                    <Typography variant="caption">Rooms</Typography>
                  </Badge>
                </CalendarDay>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default NewCalendarComponent;
