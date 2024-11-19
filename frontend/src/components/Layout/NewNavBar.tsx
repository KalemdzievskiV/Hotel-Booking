import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  styled,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import mtLogo from '../../assets/mtLogo.png';

const NavbarContainer = styled(Paper)<{ isopen: string }>(({ theme, isopen }) => ({
  position: 'fixed',
  left: '20px',
  top: '20px',
  bottom: '20px',
  width: isopen === 'true' ? '240px' : '74px',
  backgroundColor: 'white',
  borderRadius: '16px',
  transition: 'width 0.3s ease',
  overflow: 'hidden',
  zIndex: 1200,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
}));

const ToggleButton = styled(IconButton)<{ isopen: string }>(({ isopen }) => ({
    position: 'absolute', // Fix the button to the viewport
    right: '-17px', // Align to the right edge
    top: '50%', // Center vertically
    transform: 'translateY(-50%)', // Adjust vertical position
    width: '28px', // Set button width
    height: '28px', // Set button height
    backgroundColor: 'white', // Set background color
    border: '1px solid #ddd', // Set border
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)', // Add box shadow
    borderRadius: '30%', // Make it circular
    display: 'flex', // Enable flexbox layout
    alignItems: 'center', // Center items vertically
    justifyContent: 'center', // Center items horizontally
    transition: 'transform 0.3s ease, background-color 0.3s ease', // Add transitions
    cursor: 'pointer', // Change cursor to a pointer
    zIndex: 1000, // Ensure button is on top of other elements
    '&:hover': {
      backgroundColor: '#e6e6e6', // Change background color on hover
    },
    '& .MuiSvgIcon-root': {
      fontSize: '24px', // Set icon size
      color: '#666', // Set icon color
      transition: 'color 0.3s ease', // Add transition for icon color
    },
  }));
  

const NavHeader = styled(Box)(({ theme }) => ({
  padding: '16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'visible !important',
}));

const LogoImage = styled('img')({
  height: '32px',
  width: 'auto',
  objectFit: 'contain'
});

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const ContentWrapper = styled(Box)<{ isopen: string }>(({ isopen }) => ({
  marginLeft: isopen === 'true' ? '280px' : '104px',
  transition: 'margin-left 0.3s ease',
  width: `calc(100% - ${isopen === 'true' ? '300px' : '124px'})`,
  padding: '20px',
  overflow: 'hidden !important',
}));

interface NewNavBarProps {
  children?: React.ReactNode;
}

const NewNavBar: React.FC<NewNavBarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Calendar", icon: <CalendarMonthIcon />, path: "/calendar" },
    { text: "Users", icon: <PeopleIcon />, path: "/user" },
    { text: "Rooms", icon: <MeetingRoomIcon />, path: "/room" },
    { text: "Reservations", icon: <EventIcon />, path: "/reservation" },
    { text: "New Calendar", icon: <CalendarMonthIcon />, path: "/new-calendar" },
  ];

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <NavbarContainer isopen={isOpen.toString()} elevation={2}>
        <NavHeader sx={{ overflow: 'visible !important' }}>
          <LogoContainer sx={{ 
            width: '100%',
            justifyContent: isOpen ? 'flex-start' : 'center'
          }}>
            <LogoImage 
              src={mtLogo} 
              alt="MT Logo"
              sx={{ 
                height: isOpen ? '32px' : '24px',
                display: 'block'
              }}
            />
            {isOpen && (
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  whiteSpace: 'nowrap'
                }}
              >
                MT-Center Square
              </Typography>
            )}
          </LogoContainer>
          <ToggleButton 
            isopen={isOpen.toString()}
            onClick={toggleNavbar}
            size="small"
          >
            <ChevronRightIcon />
          </ToggleButton>
        </NavHeader>

        <List sx={{ 
          pt: 2,
          '& .MuiListItem-root': {
            borderRadius: '8px',
            mx: 1,
            mb: 0.5,
          }
        }}>
          {navItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => navigate(item.path)}
              sx={{
                minHeight: 48,
                px: 2.5,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 0, 
                mr: isOpen ? 2 : 'auto', 
                justifyContent: 'center',
                color: 'inherit'
              }}>
                {item.icon}
              </ListItemIcon>
              {isOpen && (
                <ListItemText 
                  primary={item.text}
                  sx={{ opacity: isOpen ? 1 : 0 }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </NavbarContainer>
      <ContentWrapper isopen={isOpen.toString()}>
        {children}
      </ContentWrapper>
    </Box>
  );
};

export default NewNavBar; 