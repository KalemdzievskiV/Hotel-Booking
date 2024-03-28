import React, { useState, useEffect } from "react";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import UserService from "../../services/UserService";
import UserRole from "../../enum/user.enum";

interface AddUserComponentProps {
  onClose: () => void;
  userToUpdate?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    userRole: string;
  };
}

function AddUserComponent({ onClose, userToUpdate }: AddUserComponentProps) {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    userRole: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // If userToUpdate is provided, populate the fields with existing user data
  useEffect(() => {
    if (userToUpdate) {
      setUser(userToUpdate);
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [userToUpdate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const handleAddUser = () => {
    UserService.createUser(user);
    // After successful addition, close the modal and refresh the page
    onClose();
    window.location.reload();
  };

  const handleEditUser = () => {
    UserService.updateUser(user);
    // After successful update, close the modal and refresh the page
    onClose();
    window.location.reload();
  };

  return (
    <div>
      <Typography variant="h6">
        {isEditing ? "Edit User" : "Add User"}
      </Typography>
      <form>
        <TextField
          name="firstName"
          label="First Name"
          value={user.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="lastName"
          label="Last Name"
          value={user.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="email"
          label="Email"
          value={user.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="phoneNumber"
          label="Phone Number"
          value={user.phoneNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="userRole"
          label="User Role"
          fullWidth
          margin="normal"
          select // Add this prop to make it a select dropdown
          value={user.userRole}
          onChange={handleChange}
        >
          {Object.values(UserRole).map((role) => (
            <MenuItem defaultValue={UserRole.USER} key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="primary"
          onClick={isEditing ? handleEditUser : handleAddUser}
        >
          {isEditing ? "Update User" : "Add User"}
        </Button>
      </form>
    </div>
  );
}

export default AddUserComponent;

