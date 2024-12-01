import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  Grid,
  Box,
  Button,
  Chip,
  Paper,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { Room } from '../../types/room.type';
import RoomService from '../../services/RoomService';
import NewNavBar from '../Layout/NewNavBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import testImage from '../../assets/test.jpeg';

const RoomDetailsComponent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        if (id) {
          const roomData = await RoomService.getRoomById(parseInt(id));
          setRoom(roomData);
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!room) {
    return <div>Room not found</div>;
  }

  return (
    <NewNavBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Rooms
        </Button>

        <Grid container spacing={4}>
          {/* Main Image and Details */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardMedia
                component="img"
                height="400"
                image={testImage}
                alt={room.name}
                sx={{ objectFit: 'cover' }}
              />
            </Card>

            {/* Room Images Gallery */}
            {room.images && room.images.length > 0 && (
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Room Gallery
                </Typography>
                <ImageList sx={{ width: '100%', height: 200 }} cols={3} rowHeight={164}>
                  {room.images.map((image, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={image.url}
                        alt={`Room view ${index + 1}`}
                        loading="lazy"
                        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Paper>
            )}

            {/* Room Description */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {room.description || 'No description available.'}
              </Typography>
            </Paper>
          </Grid>

          {/* Room Details Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h4" gutterBottom>
                {room.name}
              </Typography>
              <Typography variant="h6" color="primary" gutterBottom>
                Room #{room.number}
              </Typography>
              
              <Box sx={{ my: 2 }}>
                <Chip
                  label={room.status}
                  color={room.status === 'AVAILABLE' ? 'success' : 'error'}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={`Max Capacity: ${room.maxCapacity}`}
                  variant="outlined"
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate(`/calendar?roomId=${room.id}`)}
              >
                View Availability
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </NewNavBar>
  );
};

export default RoomDetailsComponent;
