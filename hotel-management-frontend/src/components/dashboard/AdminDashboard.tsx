import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Card,
  CardBody,
  Heading,
  Spinner,
  Center,
  Button,
} from '@chakra-ui/react';
import { FiUsers, FiHome, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import Sidebar from '../sidebar/Sidebar';
import { ReservationService } from '../../services/reservation.service';
import { HotelService } from '../../services/hotel.service';
import { formatCurrency } from '../../utils/formatters';
import { User } from '../../types/user.type';
import { Hotel } from '../../types/hotel.type';

interface DashboardStats {
  totalBookings: number;
  activeGuests: number;
  availableRooms: number;
  monthlyRevenue: number;
  recentBookings: any[];
  roomTypeStats: { type: string; percentage: number }[];
  upcomingCheckouts: any[];
}

interface StatsCardProps {
  title: string;
  stat: string;
  icon: any;
  helpText?: string;
}

function StatsCard(props: StatsCardProps) {
  const { title, stat, icon, helpText } = props;
  const bgCard = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Card bg={bgCard} shadow="lg">
      <CardBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            <Stat>
              <StatLabel fontWeight="medium" isTruncated color={textColor}>
                {title}
              </StatLabel>
              <StatNumber fontSize="2xl" fontWeight="bold">
                {stat}
              </StatNumber>
              {helpText && (
                <StatHelpText color={textColor}>
                  {helpText}
                </StatHelpText>
              )}
            </Stat>
          </Box>
          <Box p={2} bg={useColorModeValue('teal.50', 'teal.900')} rounded="full">
            <Icon as={icon} w={6} h={6} color="teal.500" />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(',', '');
};

const AdminDashboard: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotelAndStats = async () => {
      try {
        setLoading(true);
        // First, try to get the current user's hotel
        const hotelData = await HotelService.getCurrentHotel();
        setHotel(hotelData);

        // Check if hotel ID exists
        if (!hotelData.id) {
          throw new Error('Hotel ID is missing');
        }

        // Then fetch the stats for this hotel
        const statsData = await ReservationService.getHotelReservationStats(hotelData.id);
        setStats(statsData);
        console.log(statsData);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 404 || error.message === 'Hotel ID is missing') {
          setError('No hotel found. Please create a hotel to view dashboard statistics.');
        } else {
          setError('An error occurred while fetching dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHotelAndStats();
  }, []);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Sidebar />
        <Box
          ml={{ base: '100px', md: '280px' }}
          transition="margin-left 0.3s ease-in-out"
          p="6"
        >
          <Center h="calc(100vh - 12rem)">
            <Box textAlign="center">
              <Text fontSize="xl" mb={4}>{error}</Text>
              <Button
                colorScheme="blue"
                onClick={() => {
                  // Navigate to hotel creation page
                  window.location.href = '/hotels/create';
                }}
              >
                Create a Hotel
              </Button>
            </Box>
          </Center>
        </Box>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Sidebar />
        <Box
          ml={{ base: '100px', md: '280px' }}
          transition="margin-left 0.3s ease-in-out"
          p="6"
        >
          <Center h="calc(100vh - 12rem)">
            <Text>No data available</Text>
          </Center>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar />
      <Box
        ml={{ base: '100px', md: '280px' }}
        transition="margin-left 0.3s ease-in-out"
        p="6"
      >
        <Heading size="lg" mb={6}>Admin Dashboard Overview</Heading>
        
        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <StatsCard
            title="Total Bookings"
            stat={stats.totalBookings.toString()}
            icon={FiTrendingUp}
            helpText="All time bookings"
          />
          <StatsCard
            title="Active Guests"
            stat={stats.activeGuests.toString()}
            icon={FiUsers}
            helpText="Current occupancy"
          />
          <StatsCard
            title="Available Rooms"
            stat={stats.availableRooms.toString()}
            icon={FiHome}
            helpText="Ready for booking"
          />
          <StatsCard
            title="Revenue"
            stat={formatCurrency(stats.monthlyRevenue)}
            icon={FiDollarSign}
            helpText="This month"
          />
        </SimpleGrid>

        {/* Recent Bookings Table */}
        <Card mb={8}>
          <CardBody>
            <Heading size="md" mb={4}>Recent Bookings</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Guest Name</Th>
                  <Th>Room</Th>
                  <Th>Check In</Th>
                  <Th>Check Out</Th>
                  <Th isNumeric>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stats.recentBookings?.map((booking, index) => (
                  <Tr key={index}>
                    <Td>{booking.guest?.firstName} {booking.guest?.lastName}</Td>
                    <Td>{booking.room?.number} - {booking.room?.name}</Td>
                    <Td>{booking.checkInTime ? formatDateTime(booking.checkInTime) : 'N/A'}</Td>
                    <Td>{booking.checkOutTime ? formatDateTime(booking.checkOutTime) : 'N/A'}</Td>
                    <Td isNumeric>{booking.totalPrice ? `$${booking.totalPrice.toFixed(2)}` : 'N/A'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        {/* Additional Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Popular Room Types</Heading>
              <Box>
                {stats.roomTypeStats.map((stat, index) => (
                  <Box key={index} mb={3}>
                    <Text mb={2}>{stat.type} - {stat.percentage}% bookings</Text>
                    <Box bg="teal.100" w={`${stat.percentage}%`} h="2" rounded="full" />
                  </Box>
                ))}
              </Box>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Upcoming Checkouts</Heading>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Room</Th>
                    <Th>Guest</Th>
                    <Th>Checkout Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stats.upcomingCheckouts?.map((checkout, index) => (
                    <Tr key={index}>
                      <Td>{checkout.room?.number || 'N/A'}</Td>
                      <Td>{checkout.guest ? `${checkout.guest.firstName} ${checkout.guest.lastName}` : 'N/A'}</Td>
                      <Td>{checkout.checkOutTime ? formatDateTime(checkout.checkOutTime) : 'N/A'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
