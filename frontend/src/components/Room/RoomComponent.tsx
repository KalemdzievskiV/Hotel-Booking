import NavBar from "../Layout/NavBar";
import { Box, Button, Chip, IconButton, Modal, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import RoomService from "../../services/RoomService";
import { Room } from "../../types/room.type";
import AddRoomComponent from "./AddRoomComponent";
import CloseIcon from "@mui/icons-material/Close";
import CustomTable from "../shared/CustomTable";
import NewNavBar from "../Layout/NewNavBar";

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export default function RoomComponent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const columns: Column[] = [
    { id: 'number', label: 'Number', sortable: true },
    { id: 'name', label: 'Name', align: 'center', sortable: true },
    { id: 'description', label: 'Description', align: 'center', sortable: true },
    { id: 'maxCapacity', label: 'Max Capacity', align: 'center', sortable: true },
    { id: 'status', label: 'Status', align: 'center', sortable: true },
    { id: 'images', label: 'Images', align: 'center', sortable: true },
  ];

  const renderCell = (column: Column, room: Room): React.ReactNode => {
    switch (column.id) {
      case 'status':
        const statusColors = {
          AVAILABLE: 'success',
          RESERVED: 'warning',
          OCCUPIED: 'error',
          MAINTENANCE: 'default'
        } as const;
        
        return (
          <Chip
            label={room.status}
            color={statusColors[room.status as keyof typeof statusColors]}
            size="small"
            sx={{ minWidth: '90px' }}
          />
        );
      case 'images':
        if (!room.images) return 'No images';
        return `${room.images.length} images`;
      default:
        const value = room[column.id as keyof Room];
        return value?.toString() ?? '';
    }
  };

  useEffect(() => {
    RoomService.getRoomListPageable(page, rowsPerPage).then((response) => {
      setRooms(response.data);
      setTotalCount(response.totalCount);
    });
  }, [page, rowsPerPage]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setSelectedRoom(null);
    setIsModalOpen(false);
  };
  const editRoom = (room: Room) => {
    setIsModalOpen(true);
    setSelectedRoom(room);
  };

  const deleteRoom = async (room: Room) => {
    try {
      await RoomService.deleteRoom(room.id);
      // Refresh the room list after deletion
      RoomService.getRoomListPageable(page, rowsPerPage).then((response) => {
        setRooms(response.data);
        setTotalCount(response.totalCount);
      });
    } catch (error) {
      console.error('Error deleting room:', error);
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
            Add Room
          </Button>
        </div>

        <CustomTable
          columns={columns}
          data={rooms}
          onEdit={editRoom}
          onDelete={deleteRoom}
          renderCell={renderCell}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
          totalCount={totalCount}
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
          <AddRoomComponent roomToUpdate={selectedRoom!} onClose={closeModal} />
        </Box>
      </Modal>
    </NewNavBar>
  );
}
