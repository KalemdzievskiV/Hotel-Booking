import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  Button,
  Skeleton,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { RoomService } from '../services/room.service';
import { HotelService } from '../services/hotel.service';
import { Room } from '../types/room.type';
import { RoomComponent } from '../components/rooms/RoomComponent';
import { AddRoomDialog } from '../components/rooms/AddRoomDialog';
import RoomDetailsDialog from '../components/rooms/RoomDetailsDialog';
import Sidebar from '../components/sidebar/Sidebar';

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const { isOpen: isAddDialogOpen, onOpen: onAddDialogOpen, onClose: onAddDialogClose } = useDisclosure();
  const { isOpen: isDetailsDialogOpen, onOpen: onDetailsDialogOpen, onClose: onDetailsDialogClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const toast = useToast();
  const [userHotelId, setUserHotelId] = useState<number | null>(null);

  useEffect(() => {
    fetchUserHotelAndRooms();
  }, []);

  const fetchUserHotelAndRooms = async () => {
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

      setUserHotelId(hotel.id);
      const roomsData = await RoomService.getRoomsByHotel(hotel.id);
      
      console.log('Raw room data:', roomsData);
      
      // Validate room data before setting state
      const validRooms = roomsData.filter(room => {
        console.log('Checking room:', room);
        return room && room.number && room.name;
      });

      console.log('Valid rooms:', validRooms);

      if (validRooms.length !== roomsData.length) {
        console.warn(`Filtered out ${roomsData.length - validRooms.length} invalid room entries`);
        toast({
          title: 'Warning',
          description: 'Some rooms have invalid data and will not be displayed',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }

      setRooms(validRooms);
    } catch (error) {
      console.error('Error fetching hotel and rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch rooms',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = () => {
    setSelectedRoom(undefined);
    onAddDialogOpen();
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    onAddDialogOpen();
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    onDetailsDialogOpen();
  };

  const handleDeleteRoom = async (room: Room) => {
    if (!room.id) {
      toast({
        title: 'Error',
        description: 'Room ID is missing',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await RoomService.deleteRoom(room.id);
      toast({
        title: 'Success',
        description: 'Room deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchUserHotelAndRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete room',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRoomSaved = () => {
    onAddDialogClose();
    fetchUserHotelAndRooms();
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Container maxW="7xl" py="8">
          <Flex justify="space-between" align="center" mb="8">
            <Heading>Hotel Rooms</Heading>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={handleAddRoom}
              isDisabled={!userHotelId}
            >
              Add Room
            </Button>
          </Flex>

          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} height="400px" rounded="lg" />
              ))}
            </SimpleGrid>
          ) : rooms.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
              {rooms.map((room) => (
                <Box
                  key={room.id}
                  onClick={() => handleRoomClick(room)}
                  cursor="pointer"
                  bg={cardBgColor}
                  rounded="lg"
                  shadow="md"
                  overflow="hidden"
                  transition="transform 0.2s"
                  _hover={{ transform: 'translateY(-5px)' }}
                >
                  <RoomComponent
                    room={room}
                    onEdit={() => handleEditRoom(room)}
                    onDelete={() => handleDeleteRoom(room)}
                  />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" color="gray.500">
                No rooms found. Click the "Add Room" button to create one.
              </Text>
            </Box>
          )}
        </Container>

        <AddRoomDialog
          isOpen={isAddDialogOpen}
          onClose={onAddDialogClose}
          editRoom={selectedRoom}
          hotelId={userHotelId || undefined}
          onRoomAdded={handleRoomSaved}
        />

        {selectedRoom && (
          <RoomDetailsDialog
            isOpen={isDetailsDialogOpen}
            onClose={onDetailsDialogClose}
            room={selectedRoom}
          />
        )}
      </Box>
    </Box>
  );
};

export default RoomsPage;
