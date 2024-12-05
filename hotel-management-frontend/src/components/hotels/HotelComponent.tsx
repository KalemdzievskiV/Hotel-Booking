import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Image,
  Badge,
  Stack,
  Heading,
  useColorModeValue,
  Container,
  Flex,
  Icon,
  Skeleton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { FiStar, FiPhone, FiMail, FiMapPin, FiPlus } from 'react-icons/fi';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../types/hotel.type';
import Sidebar from '../sidebar/Sidebar';
import AddHotelDialog from './AddHotelDialog';

const HotelCard: React.FC<{ hotel: Hotel }> = ({ hotel }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box
      bg={cardBg}
      rounded="lg"
      shadow="md"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-5px)' }}
    >
      {/* Hotel Image */}
      <Box position="relative" h="200px">
        <Image
          src={hotel.pictures[0] || 'https://via.placeholder.com/400x200?text=Hotel+Image'}
          alt={hotel.name}
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
          colorScheme={hotel.averageRating >= 4 ? 'green' : 'orange'}
          rounded="md"
        >
          {hotel.averageRating.toFixed(1)} / 5
        </Badge>
      </Box>

      {/* Hotel Info */}
      <Stack p="6" spacing="3">
        <Heading size="md" fontWeight="bold">
          {hotel.name}
        </Heading>

        {/* Star Rating */}
        <Flex align="center">
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              as={FiStar}
              color={index < hotel.starRating ? 'yellow.400' : 'gray.300'}
              w={4}
              h={4}
            />
          ))}
        </Flex>

        {/* Contact Info */}
        <Stack spacing="2">
          <Flex align="center">
            <Icon as={FiMapPin} color={textColor} mr="2" />
            <Text color={textColor} fontSize="sm">
              {hotel.address}
            </Text>
          </Flex>
          <Flex align="center">
            <Icon as={FiPhone} color={textColor} mr="2" />
            <Text color={textColor} fontSize="sm">
              {hotel.phoneNumber}
            </Text>
          </Flex>
          <Flex align="center">
            <Icon as={FiMail} color={textColor} mr="2" />
            <Text color={textColor} fontSize="sm">
              {hotel.email}
            </Text>
          </Flex>
        </Stack>

        {/* Amenities */}
        <Flex flexWrap="wrap" gap="2">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <Badge
              key={index}
              colorScheme="blue"
              variant="subtle"
              px="2"
              py="1"
              rounded="md"
            >
              {amenity}
            </Badge>
          ))}
          {hotel.amenities.length > 3 && (
            <Badge
              colorScheme="gray"
              variant="subtle"
              px="2"
              py="1"
              rounded="md"
            >
              +{hotel.amenities.length - 3} more
            </Badge>
          )}
        </Flex>
      </Stack>
    </Box>
  );
};

const HotelComponent: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchHotels = async () => {
    try {
      console.log('Starting to fetch hotels...');
      const data = await HotelService.getAllHotels();
      console.log('Successfully fetched hotels:', data);
      setHotels(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch hotels. Please try again later.';
      setError(errorMessage);
      console.error('Error fetching hotels:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const content = (
    <Container maxW="7xl" py="8">
      <Flex justify="space-between" align="center" mb="8">
        <Heading>Our Hotels</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={onOpen}
        >
          Add Hotel
        </Button>
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
        {loading
          ? [...Array(6)].map((_, index) => (
              <Skeleton key={index} height="500px" rounded="lg" />
            ))
          : hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
      </SimpleGrid>

      <AddHotelDialog
        isOpen={isOpen}
        onClose={onClose}
        onHotelAdded={fetchHotels}
      />
    </Container>
  );

  if (error) {
    return (
      <Box minH="100vh">
        <Sidebar />
        <Box ml={{ base: 0, md: '240px' }} transition=".3s ease">
          <Container maxW="7xl" py="8">
            <Text color="red.500" textAlign="center">
              {error}
            </Text>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh">
      <Sidebar />
      <Box
        ml={{ base: 0, md: '240px' }}
        transition=".3s ease"
      >
        {content}
      </Box>
    </Box>
  );
};

export default HotelComponent;
