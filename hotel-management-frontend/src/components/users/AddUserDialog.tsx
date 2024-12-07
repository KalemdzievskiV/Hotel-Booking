import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Select,
    useToast,
    FormErrorMessage,
    Switch,
} from '@chakra-ui/react';
import { UserService } from '../../services/user.service';
import { User, UserRole } from '../../types/user.type';

interface AddUserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onUserAdded: () => void;
    userToEdit?: User | null;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
    isOpen,
    onClose,
    onUserAdded,
    userToEdit
}) => {
    const [formData, setFormData] = useState<{
        firstName: string;
        lastName: string;
        username: string;
        email: string;
        password: string;
        phoneNumber: string;
        role: UserRole;
        active: boolean;
    }>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: UserRole.STAFF,
        active: true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                ...userToEdit,
                password: '', // Don't populate password for security
            });
        } else {
            // Reset form when opening for new user
            setFormData({
                firstName: '',
                lastName: '',
                username: '',
                email: '',
                password: '',
                phoneNumber: '',
                role: UserRole.STAFF,
                active: true,
            });
        }
        setErrors({});
    }, [userToEdit, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName?.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!formData.username?.trim()) {
            newErrors.username = 'Username is required';
        }
        if (!formData.email?.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!userToEdit && !formData.password?.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password && formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.phoneNumber?.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            if (userToEdit?.id) {
                // Update existing user
                const updateData = {
                    ...formData,
                    // Only include password if it was changed
                    password: formData.password?.trim() ? formData.password : undefined,
                };
                await UserService.updateUser(userToEdit.id, updateData);
                toast({
                    title: 'Success',
                    description: 'User updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                // Create new user
                await UserService.createUser(formData);
                toast({
                    title: 'Success',
                    description: 'User created successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            onUserAdded();
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
            toast({
                title: 'Error',
                description: userToEdit ? 'Failed to update user' : 'Failed to create user',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{userToEdit ? 'Edit User' : 'Add New User'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isInvalid={!!errors.firstName}>
                            <FormLabel>First Name</FormLabel>
                            <Input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter first name"
                            />
                            <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.lastName}>
                            <FormLabel>Last Name</FormLabel>
                            <Input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter last name"
                            />
                            <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.username}>
                            <FormLabel>Username</FormLabel>
                            <Input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                            />
                            <FormErrorMessage>{errors.username}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.password}>
                            <FormLabel>{userToEdit ? 'New Password (optional)' : 'Password'}</FormLabel>
                            <Input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={userToEdit ? 'Enter new password' : 'Enter password'}
                            />
                            <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.phoneNumber}>
                            <FormLabel>Phone Number</FormLabel>
                            <Input
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Role</FormLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                                <option value={UserRole.ADMIN}>Admin</option>
                                <option value={UserRole.STAFF}>Staff</option>
                                <option value={UserRole.GUEST}>Guest</option>
                            </Select>
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                            <FormLabel mb="0">Active</FormLabel>
                            <Switch
                                name="active"
                                isChecked={formData.active}
                                onChange={handleSwitchChange}
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={handleSubmit}
                        isLoading={isLoading}
                    >
                        {userToEdit ? 'Update' : 'Create'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddUserDialog;
