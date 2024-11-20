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
  ];

  useEffect(() => {
    fetchReservations();
  }, [page, rowsPerPage, orderBy, order]);

  const fetchReservations = async () => {
    try {
      const response = await ReservationService.getReservationsPageable(page, rowsPerPage, orderBy, order);
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

  const renderCell = (column: { id: string }, reservation: Reservation) => {
    switch (column.id) {
      case 'start':
        return formatDate(reservation.start.toString());
      case 'finish':
        return formatDate(reservation.finish.toString());
      case 'user':
        return reservation.user.firstName;
      case 'room':
        return reservation.room.description;
      default:
        return '';
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
          onDelete={(reservation) => console.log('Delete reservation', reservation.id)}
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
