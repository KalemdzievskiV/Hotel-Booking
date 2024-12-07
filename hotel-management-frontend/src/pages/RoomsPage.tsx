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
import Sidebar from '../components/sidebar/Sidebar';

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
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
      setRooms(roomsData);
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
    onOpen();
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    onOpen();
  };

  const handleDeleteRoom = async (roomId: number) => {
    try {
      setRooms(rooms.filter(room => room.id !== roomId));
      toast({
        title: 'Success',
        description: 'Room deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting room:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete room',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Refresh the rooms list to ensure UI is in sync with backend
      fetchUserHotelAndRooms();
    }
  };

  const handleRoomSaved = () => {
    onClose();
    fetchUserHotelAndRooms();
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar />
      <Box ml={{ base: 0, md: 60 }} p="4">
        <Container maxW="container.xl" py={5}>
          {/* Header */}
          <Flex justify="space-between" align="center" mb={6}>
            <Box>
              <Heading size="lg" mb={2}>
                Rooms
              </Heading>
              <Text color={textColor}>
                Manage your hotel rooms
              </Text>
            </Box>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={handleAddRoom}
              isDisabled={!userHotelId}
            >
              Add Room
            </Button>
          </Flex>

          {/* Rooms Grid */}
          {loading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height="400px" rounded="lg" />
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {rooms.map((room) => (
                <RoomComponent
                  key={room.id}
                  room={room}
                  onEdit={handleEditRoom}
                  onDelete={handleDeleteRoom}
                />
              ))}
            </SimpleGrid>
          )}

          {/* Add/Edit Room Dialog */}
          <AddRoomDialog
            isOpen={isOpen}
            onClose={onClose}
            onRoomAdded={handleRoomSaved}
            hotelId={userHotelId || undefined}
            editRoom={selectedRoom}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default RoomsPage;
