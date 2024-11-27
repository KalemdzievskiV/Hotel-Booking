import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, Paper } from "@mui/material";
import UserService from "../../services/UserService";
import { User } from "../../types/user.type";
import AddUserComponent from "./AddUserComponent";
import CloseIcon from "@mui/icons-material/Close";
import NewNavBar from "../Layout/NewNavBar";
import CustomTable from "../shared/CustomTable";

function UserComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const columns = [
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name', align: 'center' as const },
    { id: 'email', label: 'Email', align: 'center' as const },
    { id: 'phoneNumber', label: 'Phone', align: 'center' as const },
    { id: 'userRole', label: 'Role', align: 'center' as const },
  ];

  const renderCell = (column: { id: string }, user: User) => {
    return user[column.id as keyof User];
  };

  useEffect(() => {
    UserService.getUserListPageable(page, rowsPerPage).then((response) => {
      setUsers(response.data);
      setTotalCount(response.totalCount);
    });
  }, [page, rowsPerPage]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };
  const editUser = (user: User) => {
    setIsModalOpen(true);
    setSelectedUser(user);
  };

  const deleteUser = async (user: User) => {
    try {
      await UserService.deleteUser(user.id);
      // Refresh the user list after deletion
      UserService.getUserListPageable(page, rowsPerPage).then((response) => {
        setUsers(response.data);
        setTotalCount(response.totalCount);
      });
    } catch (error) {
      console.error('Error deleting user:', error);
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
            Add User
          </Button>
        </div>
        
        <CustomTable
          columns={columns}
          data={users}
          onEdit={editUser}
          onDelete={deleteUser}
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
          <AddUserComponent userToUpdate={selectedUser!} onClose={closeModal} />
        </Box>
      </Modal>
    </NewNavBar>
  );
}

export default UserComponent;
