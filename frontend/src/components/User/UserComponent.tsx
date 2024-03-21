import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import UserService from "../../services/UserService";
import { User } from "../../types/user.type";
import AddUserComponent from "./AddUserComponent";
import CloseIcon from "@mui/icons-material/Close";
import NavBar from "../Layout/NavBar";

function UserComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    UserService.getUsers().then((data) => setUsers(data));
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const editUser = (user: User) => {
    setIsModalOpen(true);
    setSelectedUser(user); // Set the selected user
  };

  return (
    <div>
      <Paper className="mt-2">
      <div className="mx-3 mb-2">
      <Button variant="outlined" color="success" onClick={openModal}>Add User</Button>
      </div>
      <TableContainer className="mx-2">
        <Table
          size="medium"
          sx={{marginTop: "10vh", margin: "auto",}}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell align="right">Last Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onDoubleClick={() => editUser(user)}
                style={{ cursor: "pointer" }}
              >
                <TableCell component="th" scope="row">
                  {user.firstName}
                </TableCell>
                <TableCell align="right">{user.lastName}</TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="right">{user.phoneNumber}</TableCell>
                <TableCell align="right">{user.userRole}</TableCell>
                <TableCell align="right"><Chip label="Delete"></Chip></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
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
      </Paper>
    </div>
  );
}

export default UserComponent;
