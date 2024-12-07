import React from 'react';
import {
  Box,
  Text,
  Image,
  Badge,
  Stack,
  useColorModeValue,
  Icon,
  Flex,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { FiDollarSign, FiHome, FiInfo, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Room, RoomStatus } from '../../types/room.type';
import { RoomService } from '../../services/room.service';

interface RoomComponentProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: number) => void;
}

export const RoomComponent: React.FC<RoomComponentProps> = ({ room, onEdit, onDelete }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const toast = useToast();

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'green';
      case RoomStatus.OCCUPIED:
        return 'red';
      case RoomStatus.MAINTENANCE:
        return 'orange';
      default:
        return 'gray';
    }
  };

  const handleEdit = () => {
    onEdit(room);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        if (!room.id) {
          throw new Error('Room ID is undefined');
        }
        await RoomService.deleteRoom(room.id);
        onDelete(room.id);
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
      }
    }
  };

  return (
    <Box
      bg={cardBg}
      rounded="lg"
      shadow="md"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-5px)' }}
      position="relative"
    >
      <Box position="relative" h="200px">
        <Image
          src={room.pictures[0] || 'https://via.placeholder.com/400x200?text=Room+Image'}
          alt={room.name}
          objectFit="cover"
          w="100%"
          h="100%"
        />
        <Badge
          position="absolute"
          top="4"
          right="4"
          px="2"
          py="1"
          colorScheme={getStatusColor(room.status)}
          rounded="md"
        >
          {room.status}
        </Badge>
        <Flex
          position="absolute"
          top="4"
          left="4"
          gap="2"
        >
          <IconButton
            aria-label="Edit room"
            icon={<Icon as={FiEdit} />}
            size="sm"
            colorScheme="blue"
            onClick={handleEdit}
          />
          <IconButton
            aria-label="Delete room"
            icon={<Icon as={FiTrash2} />}
            size="sm"
            colorScheme="red"
            onClick={handleDelete}
          />
        </Flex>
      </Box>

      <Box p="6">
        <Stack spacing={2}>
          <Text
            fontSize="2xl"
            fontWeight="semibold"
            lineHeight="tight"
          >
            {room.name}
          </Text>

          <Text color={textColor} fontSize="md">
            Room {room.number}
          </Text>

          {room.description && (
            <Flex align="center" mt={2}>
              <Icon as={FiInfo} mr={2} color={textColor} />
              <Text color={textColor} fontSize="sm" noOfLines={2}>
                {room.description}
              </Text>
            </Flex>
          )}

          <Flex align="center" mt={2}>
            <Icon as={FiDollarSign} mr={2} color={textColor} />
            <Text color={textColor} fontSize="lg" fontWeight="semibold">
              ${room.price}/night
            </Text>
          </Flex>

          <Flex align="center">
            <Icon as={FiHome} mr={2} color={textColor} />
            <Text color={textColor} fontSize="sm">
              {room.hotel.name}
            </Text>
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
};
