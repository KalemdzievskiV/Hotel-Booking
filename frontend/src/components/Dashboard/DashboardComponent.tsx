import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import NewNavBar from '../Layout/NewNavBar';
import RoomService from '../../services/RoomService';
import ReservationService from '../../services/ReservationService';
import { Room } from '../../types/room.type';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardComponent: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
    totalReservations: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rooms, reservations] = await Promise.all([
          RoomService.getRoomList(),
          ReservationService.getReservationList(),
        ]);

        const roomStats = {
          totalRooms: rooms.length,
          availableRooms: rooms.filter((room: Room) => room.status === 'AVAILABLE').length,
          occupiedRooms: rooms.filter((room: Room) => room.status === 'OCCUPIED').length,
          maintenanceRooms: rooms.filter((room: Room) => room.status === 'MAINTENANCE').length,
          totalReservations: reservations.length,
        };

        setStats(roomStats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const roomStatusData = {
    labels: ['Available', 'Occupied', 'Maintenance'],
    datasets: [
      {
        data: [stats.availableRooms, stats.occupiedRooms, stats.maintenanceRooms],
        backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
      },
    ],
  };

  const roomOccupancyData = {
    labels: ['Available', 'Occupied', 'Maintenance'],
    datasets: [
      {
        label: 'Number of Rooms',
        data: [stats.availableRooms, stats.occupiedRooms, stats.maintenanceRooms],
        backgroundColor: ['rgba(76, 175, 80, 0.6)', 'rgba(244, 67, 54, 0.6)', 'rgba(255, 152, 0, 0.6)'],
      },
    ],
  };

  if (loading) {
    return (
      <NewNavBar>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress />
        </Box>
      </NewNavBar>
    );
  }

  return (
    <NewNavBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Rooms
                </Typography>
                <Typography variant="h4">{stats.totalRooms}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Available Rooms
                </Typography>
                <Typography variant="h4" style={{ color: '#4caf50' }}>
                  {stats.availableRooms}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Reservations
                </Typography>
                <Typography variant="h4" style={{ color: '#2196f3' }}>
                  {stats.totalReservations}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Room Status Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <Pie data={roomStatusData} options={{ maintainAspectRatio: false }} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Room Occupancy
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar
                  data={roomOccupancyData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </NewNavBar>
  );
};

export default DashboardComponent;
