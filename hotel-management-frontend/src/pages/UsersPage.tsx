import React, { useEffect, useState } from 'react';
import { UserService } from '../services/user.service';
import { User, UserRole } from '../types/user.type';
import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Heading,
    IconButton,
    useColorModeValue,
    useToast,
    Flex,
    Stack,
    Card,
    CardBody,
    Badge,
    useBreakpointValue,
    Hide,
    Show,
    Container,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import AddUserDialog from '../components/users/AddUserDialog';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const toast = useToast();
    
    const bgColor = useColorModeValue('white', 'gray.800');
    const headerBgColor = useColorModeValue('gray.50', 'gray.700');
    const pageBg = useColorModeValue('gray.50', 'gray.900');
    const isMobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const fetchedUsers = await UserService.getAllUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Error loading users:', error);
            toast({
                title: 'Error',
                description: 'Failed to load users',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsAddUserOpen(true);
    };

    const handleEditUser = (userId: number) => {
        const userToEdit = users.find(user => user.id === userId);
        if (userToEdit) {
            setSelectedUser(userToEdit);
            setIsAddUserOpen(true);
        }
    };

    const handleCloseDialog = () => {
        setSelectedUser(null);
        setIsAddUserOpen(false);
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await UserService.deleteUser(userId);
                await loadUsers();
                toast({
                    title: 'Success',
                    description: 'User deleted successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } catch (error) {
                console.error('Error deleting user:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to delete user',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    };

    const MobileUserCard: React.FC<{ user: User }> = ({ user }) => (
        <Card mb={4} bg={bgColor} shadow="sm">
            <CardBody>
                <Stack spacing={3}>
                    <Box>
                        <Text fontWeight="bold">{`${user.firstName} ${user.lastName}`}</Text>
                        <Text fontSize="sm" color="gray.500">{user.email}</Text>
                    </Box>
                    <Flex justify="space-between" align="center">
                        <Badge colorScheme={user.role === UserRole.ADMIN ? 'purple' : 'blue'}>
                            {user.role}
                        </Badge>
                        <Badge colorScheme={user.active ? 'green' : 'red'}>
                            {user.active ? 'Active' : 'Inactive'}
                        </Badge>
                    </Flex>
                    <Text fontSize="sm">{user.phoneNumber}</Text>
                    <Flex justify="flex-end" gap={2}>
                        <IconButton
                            aria-label="Edit user"
                            icon={<EditIcon />}
                            size="sm"
                            colorScheme="blue"
                            onClick={() => user.id && handleEditUser(user.id)}
                        />
                        <IconButton
                            aria-label="Delete user"
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => user.id && handleDeleteUser(user.id)}
                        />
                    </Flex>
                </Stack>
            </CardBody>
        </Card>
    );

    return (
        <Box h="100vh" position="relative">
            <Flex h="full">
                <Sidebar />
                <Box
                    as="main"
                    flex="1"
                    ml={{ base: 0, md: "256px" }}
                    transition="margin 0.3s"
                    p={{ base: 4, md: 6 }}
                    bg={pageBg}
                    overflowY="auto"
                    position="relative"
                >
                    <Stack spacing={{ base: 4, md: 6 }}>
                        <Flex 
                            direction={{ base: 'column', sm: 'row' }}
                            justify="space-between" 
                            align={{ base: 'stretch', sm: 'center' }}
                            gap={4}
                        >
                            <Heading size={{ base: "md", md: "lg" }}>Users Management</Heading>
                            <Button
                                leftIcon={<AddIcon />}
                                colorScheme="blue"
                                onClick={handleAddUser}
                                w={{ base: '100%', sm: 'auto' }}
                            >
                                Add User
                            </Button>
                        </Flex>

                        {/* Desktop View */}
                        <Hide below="md">
                            <Box 
                                bg={bgColor} 
                                borderRadius="lg" 
                                shadow="sm"
                                overflow="hidden"
                            >
                                <Box overflowX="auto">
                                    <Table variant="simple" size="md">
                                        <Thead bg={headerBgColor} position="sticky" top={0} zIndex={1}>
                                            <Tr>
                                                <Th>Name</Th>
                                                <Th>Email</Th>
                                                <Th>Role</Th>
                                                <Th>Phone Number</Th>
                                                <Th>Status</Th>
                                                <Th>Actions</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {users.map((user) => (
                                                <Tr key={user.id}>
                                                    <Td>{`${user.firstName} ${user.lastName}`}</Td>
                                                    <Td>{user.email}</Td>
                                                    <Td>
                                                        <Badge colorScheme={user.role === UserRole.ADMIN ? 'purple' : 'blue'}>
                                                            {user.role}
                                                        </Badge>
                                                    </Td>
                                                    <Td>{user.phoneNumber}</Td>
                                                    <Td>
                                                        <Badge
                                                            colorScheme={user.active ? 'green' : 'red'}
                                                        >
                                                            {user.active ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </Td>
                                                    <Td>
                                                        <IconButton
                                                            aria-label="Edit user"
                                                            icon={<EditIcon />}
                                                            size="sm"
                                                            colorScheme="blue"
                                                            mr={2}
                                                            onClick={() => user.id && handleEditUser(user.id)}
                                                        />
                                                        <IconButton
                                                            aria-label="Delete user"
                                                            icon={<DeleteIcon />}
                                                            size="sm"
                                                            colorScheme="red"
                                                            onClick={() => user.id && handleDeleteUser(user.id)}
                                                        />
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>
                            </Box>
                        </Hide>

                        {/* Mobile View */}
                        <Show below="md">
                            <Stack spacing={4}>
                                {users.map((user) => (
                                    <MobileUserCard key={user.id} user={user} />
                                ))}
                            </Stack>
                        </Show>
                    </Stack>

                    <AddUserDialog
                        isOpen={isAddUserOpen}
                        onClose={handleCloseDialog}
                        onUserAdded={loadUsers}
                        userToEdit={selectedUser}
                    />
                </Box>
            </Flex>
        </Box>
    );
};

export default UsersPage;
