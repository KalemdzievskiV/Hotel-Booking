import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, Paper } from "@mui/material";
import UserService from "../../services/UserService";
import { User } from "../../types/user.type";
import AddUserComponent from "./AddUserComponent";
import CloseIcon from "@mui/icons-material/Close";
import NavBar from "../Layout/NavBar";
import CustomTable from "../shared/CustomTable";

function UserComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
    UserService.getUsers().then((data) => setUsers(data));
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };
  const editUser = (user: User) => {
    setIsModalOpen(true);
    setSelectedUser(user);
  };

  return (
    <div>
      <NavBar />
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          margin: "auto",
          marginTop: "2vh",
          maxWidth: "90%",
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
          onDelete={(user) => console.log('Delete user', user.id)}
          renderCell={renderCell}
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
    </div>
  );
}

export default UserComponent;
