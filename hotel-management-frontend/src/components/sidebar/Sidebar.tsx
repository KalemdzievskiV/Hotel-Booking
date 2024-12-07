import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  Avatar,
  useColorModeValue,
  Collapse,
  Center,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Button,
  useToast,
  Divider,
} from '@chakra-ui/react';
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiChevronUp,
  FiMenu,
  FiLogOut,
  FiLogIn,
  FiMapPin,
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth.service';
import { ColorModeToggle } from '../ColorModeToggle';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFooterOpen, setIsFooterOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
  const currentUser = authService.getCurrentUser();

  const bgColor = useColorModeValue('white', 'gray.800');
  const secondaryBgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

  const NavItems = [
    { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
    { name: 'Hotels', icon: FiMapPin, path: '/hotels' },
    { name: 'Rooms', icon: FiHome, path: '/rooms' },
    { name: 'Calendar', icon: FiCalendar, path: '/calendar' },
    { name: 'Users', icon: FiUsers, path: '/users' },
    { name: 'Bookings', icon: FiCalendar, path: '/bookings' },
    { name: 'Guests', icon: FiUsers, path: '/guests' },
    { name: 'Settings', icon: FiSettings, path: '/settings' },
  ];

  const handleToggle = () => {
    if (isMobile) {
      onOpen();
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const SidebarContent = () => (
    <Box
      w={isMobile ? "full" : (isCollapsed ? '80px' : '256px')}
      bg={bgColor}
      borderRadius={isMobile ? "0" : "16px"}
      h="full"
      position="relative"
    >
      {/* Toggle Button - Only show on desktop */}
      {!isMobile && (
        <Box
          position="absolute"
          right="-6px"
          top="50%"
          transform="translateY(-50%)"
          w="12px"
          h="50px"
          bg={bgColor}
          borderRightRadius="6px"
          boxShadow="2px 0 4px rgba(0, 0, 0, 0.1)"
          cursor="pointer"
          onClick={handleToggle}
          _hover={{ bg: secondaryBgColor }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={2}
        >
          <Box
            w="0"
            h="0"
            borderTop="4px solid transparent"
            borderBottom="4px solid transparent"
            borderLeft={isCollapsed ? "none" : "4px solid"}
            borderRight={isCollapsed ? "4px solid" : "none"}
            borderLeftColor={secondaryTextColor}
            borderRightColor={secondaryTextColor}
            transform={isCollapsed ? "translateX(1px)" : "translateX(-1px)"}
            transition="all 0.3s ease-in-out"
          />
        </Box>
      )}

      {/* Header */}
      <Flex
        h="80px"
        align="center"
        px="4"
        borderBottom="1px solid"
        borderColor={secondaryBgColor}
      >
        {isCollapsed && !isMobile ? (
          <Center w="full">
            <Text fontSize="xl" fontWeight="bold">
              HA
            </Text>
          </Center>
        ) : (
          <Text fontSize="xl" fontWeight="bold">
            Hotel Admin
          </Text>
        )}
      </Flex>

      {/* Navigation Items */}
      <VStack spacing="1" align="stretch" pt="4">
        {NavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Flex
              key={item.path}
              align="center"
              h="40px"
              cursor="pointer"
              role="group"
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  onClose();
                }
              }}
              bg={isActive ? secondaryBgColor : 'transparent'}
              _hover={{ bg: secondaryBgColor }}
              transition="all 0.2s"
            >
              <Center w={isCollapsed && !isMobile ? "full" : "14"} h="full">
                <Icon
                  as={item.icon}
                  w="5"
                  h="5"
                  color={isActive ? textColor : secondaryTextColor}
                  _groupHover={{ color: textColor }}
                />
              </Center>
              {(!isCollapsed || isMobile) && (
                <Text
                  color={isActive ? textColor : secondaryTextColor}
                  _groupHover={{ color: textColor }}
                >
                  {item.name}
                </Text>
              )}
            </Flex>
          );
        })}
      </VStack>

      {/* Footer */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        bg={secondaryBgColor}
        borderBottomRadius={isMobile ? "0" : "16px"}
      >
        {/* Color Mode Toggle */}
        <Flex
          align="center"
          justify="center"
          py="2"
          borderTop="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
          <ColorModeToggle />
        </Flex>

        {/* Login/Logout Button */}
        <Flex
          align="center"
          h="40px"
          cursor="pointer"
          role="group"
          onClick={currentUser ? handleLogout : handleLogin}
          _hover={{ bg: secondaryBgColor }}
          transition="all 0.2s"
          borderTop="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
        >
          <Center w={isCollapsed && !isMobile ? "full" : "14"} h="full">
            <Icon
              as={currentUser ? FiLogOut : FiLogIn}
              w="5"
              h="5"
              color={secondaryTextColor}
              _groupHover={{ color: textColor }}
            />
          </Center>
          {(!isCollapsed || isMobile) && (
            <Text
              color={secondaryTextColor}
              _groupHover={{ color: textColor }}
            >
              {currentUser ? 'Logout' : 'Login'}
            </Text>
          )}
        </Flex>

        <Flex
          p="4"
          align="center"
          cursor="pointer"
          onClick={() => !isCollapsed && setIsFooterOpen(!isFooterOpen)}
        >
          <Center w={isCollapsed && !isMobile ? "full" : "auto"}>
            <Avatar size="sm" name="Admin User" src="https://bit.ly/broken-link" />
          </Center>
          {(!isCollapsed || isMobile) && (
            <>
              <Box ml="4" flex="1">
                <Text fontSize="sm" fontWeight="bold">Admin User</Text>
                <Text fontSize="xs" color={secondaryTextColor}>Administrator</Text>
              </Box>
              <Icon
                as={FiChevronUp}
                transform={isFooterOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                transition="transform 0.3s"
              />
            </>
          )}
        </Flex>
        <Collapse in={isFooterOpen && (!isCollapsed || isMobile)}>
          <Box p="4" fontSize="sm" color={secondaryTextColor}>
            Hotel Management System v1.0
          </Box>
        </Collapse>
      </Box>
    </Box>
  );

  // Mobile hamburger menu button
  const MobileMenuButton = () => (
    <Box
      display={{ base: "block", md: "none" }}
      position="fixed"
      top="4"
      left="4"
      zIndex={20}
      onClick={handleToggle}
      cursor="pointer"
    >
      <Icon as={FiMenu} w="6" h="6" />
    </Box>
  );

  return (
    <>
      <MobileMenuButton />
      
      {/* Desktop sidebar */}
      {!isMobile && (
        <Box
          position="fixed"
          left="4"
          top="4"
          h="calc(100vh - 32px)"
          transition="all 0.3s ease-in-out"
          overflow="visible"
          zIndex={20}
        >
          <SidebarContent />
        </Box>
      )}

      {/* Mobile drawer */}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent />
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
