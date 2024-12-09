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

  // If room is undefined or missing required properties, show an error state
  if (!room || !room.number || !room.name) {
    return (
      <Box
        bg={cardBg}
        rounded="lg"
        shadow="md"
        p={4}
        textAlign="center"
      >
        <Text color="red.500">Invalid room data</Text>
      </Box>
    );
  }

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
      position="relative"
    >
      {/* Room Actions */}
      <Flex
        position="absolute"
        top={2}
        right={2}
        zIndex={1}
        gap={2}
      >
        <IconButton
          aria-label="Edit room"
          icon={<Icon as={FiEdit} />}
          size="sm"
          colorScheme="blue"
          onClick={() => onEdit(room)}
        />
        <IconButton
          aria-label="Delete room"
          icon={<Icon as={FiTrash2} />}
          size="sm"
          colorScheme="red"
          onClick={() => room.id && onDelete(room.id)}
        />
      </Flex>

      {/* Room Image */}
      <Box h="200px" bg="gray.100">
        {room.pictures && room.pictures.length > 0 ? (
          <Image
            src={room.pictures[0]}
            alt={room.name}
            objectFit="cover"
            w="100%"
            h="100%"
          />
        ) : (
          <Flex
            h="100%"
            align="center"
            justify="center"
            bg="gray.100"
          >
            <Text color="gray.500">No image available</Text>
          </Flex>
        )}
      </Box>

      <Box p={4}>
        <Stack spacing={2}>
          <Flex justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="semibold">
              Room {room.number}
            </Text>
            {room.status && (
              <Badge colorScheme={getStatusColor(room.status)}>
                {room.status}
              </Badge>
            )}
          </Flex>

          <Text fontSize="lg" color={textColor}>
            {room.name}
          </Text>

          {room.description && (
            <Flex align="center">
              <Icon as={FiInfo} mr={2} color={textColor} />
              <Text color={textColor} fontSize="sm" noOfLines={2}>
                {room.description}
              </Text>
            </Flex>
          )}

          {room.price && (
            <Flex align="center" mt={2}>
              <Icon as={FiDollarSign} mr={2} color={textColor} />
              <Text color={textColor} fontSize="lg" fontWeight="semibold">
                ${room.price}/night
              </Text>
            </Flex>
          )}

          {room.hotel?.name && (
            <Flex align="center">
              <Icon as={FiHome} mr={2} color={textColor} />
              <Text color={textColor} fontSize="sm">
                {room.hotel.name}
              </Text>
            </Flex>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
