import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  styled,
  useTheme,
  useMediaQuery,
  Button,
  Divider
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventIcon from '@mui/icons-material/Event';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import mtLogo from '../../assets/mtLogo.png';
import { authService } from '../../services/authService';

const NavbarContainer = styled(Paper)<{ isopen: string }>(({ theme, isopen }) => ({
  position: 'fixed',
  left: '20px',
  top: '20px',
  bottom: '20px',
  width: isopen === 'true' ? '240px' : '74px',
  backgroundColor: 'white',
  borderRadius: '16px',
  transition: 'width 0.3s ease',
  overflow: 'visible',
  zIndex: 1200,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  [theme.breakpoints.down('sm')]: {
    left: '0',
    width: isopen === 'true' ? '100%' : '74px',
    top: 0,
    bottom: 0,
    borderRadius: 0,
  },
}));

const StyledList = styled(List)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  '& .MuiListItem-root': {
    borderRadius: '8px',
    margin: '0 8px 4px 8px',
    width: 'auto',
  }
}));

const StyledListItemButton = styled(ListItemButton)<{ isopen: string }>(({ theme, isopen }) => ({
  minHeight: 48,
  padding: '8px 12px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: isopen === 'true' ? theme.spacing(2) : 'auto',
    justifyContent: 'center',
    color: 'inherit'
  }
}));

const NavHeader = styled(Box)(({ theme }) => ({
  padding: '16px',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'visible',
}));

const ToggleButtonContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '-14px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1201,
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    right: '20px',
    top: '20px',
    transform: 'none',
  },
}));

const ToggleButton = styled(IconButton)<{ isopen: string }>(({ theme, isopen }) => ({
  width: '28px',
  height: '28px',
  backgroundColor: 'white',
  border: '1px solid #ddd',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
  borderRadius: '50%',
  padding: 0,
  minWidth: '28px',
  minHeight: '28px',
  transform: isopen === 'true' ? 'rotate(180deg)' : 'rotate(0)',
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#e6e6e6',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '20px',
    color: '#666',
  },
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

const ContentWrapper = styled(Box)<{ isopen: string }>(({ theme, isopen }) => ({
  marginLeft: isopen === 'true' ? '280px' : '104px',
  transition: 'margin-left 0.3s ease',
  width: `calc(100% - ${isopen === 'true' ? '300px' : '124px'})`,
  padding: '20px',
  overflow: 'hidden !important',
  [theme.breakpoints.down('sm')]: {
    marginLeft: '84px',
    width: 'calc(100% - 84px)',
    padding: '10px',
  },
}));

const AuthContainer = styled(Box)(({ theme }) => ({
  marginTop: 'auto',
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
}));

interface NewNavBarProps {
  children?: React.ReactNode;
}

interface NavItem {
  text: string;
  icon: JSX.Element;
  path: string;
}

interface AuthItem {
  text: string;
  icon: JSX.Element;
  path?: string;
  onClick?: () => void;
}

const NewNavBar: React.FC<NewNavBarProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      setUserInfo(JSON.parse(user));
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserInfo(null);
    navigate('/login');
  };

  const navItems: NavItem[] = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Calendar", icon: <CalendarMonthIcon />, path: "/calendar" },
    { text: "Users", icon: <PeopleIcon />, path: "/user" },
    { text: "Rooms", icon: <MeetingRoomIcon />, path: "/room" },
    { text: "Reservations", icon: <EventIcon />, path: "/reservation" },
    { text: "New Calendar", icon: <CalendarMonthIcon />, path: "/new-calendar" },
    { text: "Dashboard", icon: <HomeIcon />, path: "/dashboard" },
  ];

  const authItems: AuthItem[] = isAuthenticated ? [
    { text: "Logout", icon: <LogoutIcon />, onClick: handleLogout }
  ] : [
    { text: "Login", icon: <LoginIcon />, path: "/login" },
    { text: "Sign Up", icon: <PersonAddIcon />, path: "/signup" }
  ];

  const handleAuthItemClick = (item: AuthItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <NavbarContainer isopen={isOpen.toString()} elevation={2}>
        <NavHeader>
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
          <ToggleButtonContainer>
            <ToggleButton 
              isopen={isOpen.toString()}
              onClick={toggleNavbar}
              size="small"
            >
              <ChevronRightIcon />
            </ToggleButton>
          </ToggleButtonContainer>
        </NavHeader>

        <StyledList>
          {navItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <StyledListItemButton
                onClick={() => handleNavigation(item.path)}
                isopen={isOpen.toString()}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                {isOpen && (
                  <ListItemText 
                    primary={item.text}
                    sx={{ opacity: isOpen ? 1 : 0 }}
                  />
                )}
              </StyledListItemButton>
            </ListItem>
          ))}
          
          {isOpen && userInfo && (
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Signed in as:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {userInfo.firstName} {userInfo.lastName}
              </Typography>
            </Box>
          )}
        </StyledList>

        <AuthContainer>
          {authItems.map((item, index) => (
            <ListItem key={`auth-${index}`} disablePadding>
              <StyledListItemButton
                onClick={() => handleAuthItemClick(item)}
                isopen={isOpen.toString()}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                {isOpen && (
                  <ListItemText 
                    primary={item.text}
                    sx={{ opacity: isOpen ? 1 : 0 }}
                  />
                )}
              </StyledListItemButton>
            </ListItem>
          ))}
        </AuthContainer>
      </NavbarContainer>
      <ContentWrapper isopen={isOpen.toString()}>
        {children}
      </ContentWrapper>
    </Box>
  );
};

export default NewNavBar;