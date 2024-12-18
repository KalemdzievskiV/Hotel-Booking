import NewNavBar from "../Layout/NewNavBar";
import { Box, Button, IconButton, Modal, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import ReservationService from "../../services/ReservationService";
import { Reservation } from "../../types/reservation.type";
import AddReservationComponent from "./AddReservationComponent";
import CloseIcon from "@mui/icons-material/Close";
import CustomTable from "../shared/CustomTable";

export default function ReservationComponent() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [orderBy, setOrderBy] = useState<string>('start');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const columns = [
    { id: 'start', label: 'Start', align: 'left' as const, sortable: true },
    { id: 'finish', label: 'End', align: 'center' as const, sortable: true },
    { id: 'user', label: 'User', align: 'center' as const, sortable: true },
    { id: 'room', label: 'Room', align: 'center' as const, sortable: true },
    { id: 'status', label: 'Status', align: 'center' as const, sortable: true },
  ];

  useEffect(() => {
    fetchReservations();
  }, [page, rowsPerPage, orderBy, order]);

  const fetchReservations = async () => {
    try {
      const response = await ReservationService.getReservationsPageable(page, rowsPerPage, orderBy, order);
      console.log('Reservation response:', response.data);
      setReservations(response.data);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleSort = (column: string, newOrder: 'asc' | 'desc') => {
    setOrder(newOrder);
    setOrderBy(column);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setSelectedReservation(null);
    setIsModalOpen(false);
  };
  const editReservation = (reservation: Reservation) => {
    setIsModalOpen(true);
    setSelectedReservation(reservation);
  };

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return '#fdba74'; // Pastel orange
      case 'BOOKED':
        return '#93c5fd'; // Pastel blue
      case 'CANCELED':
        return '#fca5a5'; // Pastel red
      case 'ACTIVE':
        return '#86efac'; // Pastel green
      default:
        return '#e5e7eb'; // Light gray
    }
  };

  const renderCell = (column: { id: string }, reservation: Reservation) => {
    if (!reservation) return '';
    
    switch (column.id) {
      case 'start':
        return formatDate(reservation.start.toString());
      case 'finish':
        return formatDate(reservation.finish.toString());
      case 'user':
        if (!reservation.user) {
          return <Box sx={{ 
            color: 'warning.main', 
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <span>⚠️</span>
            <span>Incomplete Reservation</span>
          </Box>;
        }
        return `${reservation.user.firstName || ''} ${reservation.user.lastName || ''}`.trim() || 'Unknown User';
      case 'room':
        if (!reservation.room) {
          return <Box sx={{ 
            color: 'warning.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <span>⚠️</span>
            <span>No Room Assigned</span>
          </Box>;
        }
        return `Room ${reservation.room.number} - ${reservation.room.name}`;
      case 'status':
        return <Box sx={{ 
          backgroundColor: getStatusColor(reservation.status),
          color: '#374151',
          py: 0.5,
          px: 1.5,
          borderRadius: '16px',
          display: 'inline-block',
          fontSize: '0.875rem',
          fontWeight: 500
        }}>
          {reservation.status}
        </Box>;
      default:
        return '';
    }
  };

  const deleteReservation = async (reservation: Reservation) => {
    try {
      await ReservationService.deleteReservation(reservation.id);
      // Refresh the reservation list after deletion
      ReservationService.getReservationsPageable(page, rowsPerPage).then((response) => {
        setReservations(response.data);
        setTotalCount(response.totalCount);
      });
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  return (
    <NewNavBar>
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          margin: "5px 20px 20px 20px",
          backgroundColor: "#f4f6f8",
        }}
      >
        <div className="mx-3 mb-2" style={{ textAlign: "right" }}>
          <Button
            variant="outlined"
            color="success"
            onClick={openModal}
            style={{ marginBottom: "20px" }}
          >
            Add Reservation
          </Button>
        </div>

        <CustomTable
          columns={columns}
          data={reservations}
          onEdit={editReservation}
          onDelete={deleteReservation}
          renderCell={renderCell}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          totalCount={totalCount}
          defaultSortColumn={orderBy}
          onSort={handleSort}
        />
      </Paper>

      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <IconButton
            onClick={closeModal}
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
            }}
          >
            <CloseIcon />
          </IconButton>
          <AddReservationComponent
            start={new Date()}
            end={new Date()}
            reservationToUpdate={selectedReservation!}
            onClose={closeModal}
          />
        </Box>
      </Modal>
    </NewNavBar>
  );
}
