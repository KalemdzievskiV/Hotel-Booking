import NavBar from "../Layout/NavBar";
import { Box, Button, IconButton, Modal, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import RoomService from "../../services/RoomService";
import { Room } from "../../types/room.type";
import AddRoomComponent from "./AddRoomComponent";
import CloseIcon from "@mui/icons-material/Close";
import CustomTable from "../shared/CustomTable";
import NewNavBar from "../Layout/NewNavBar";

export default function RoomComponent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const columns = [
    { id: 'number', label: 'Number', sortable: true },
    { id: 'name', label: 'Name', align: 'center' as const, sortable: true },
    { id: 'status', label: 'Status', align: 'center' as const, sortable: true },
    { id: 'description', label: 'Description', align: 'center' as const, sortable: true },
    { id: 'maxCapacity', label: 'Max Capacity', align: 'center' as const, sortable: true },
  ];

  const renderCell = (column: { id: string }, room: Room) => {
    return room[column.id as keyof Room];
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
            ADD ROOM
          </Button>
        </div>
        
        <CustomTable
          columns={columns}
          data={rooms}
          onEdit={editRoom}
          onDelete={(room) => console.log('Delete room', room.id)}
          renderCell={renderCell}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
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
