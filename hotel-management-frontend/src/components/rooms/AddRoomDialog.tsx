import React, { useEffect, useState } from 'react';
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
    FormErrorMessage,
    Input,
    Select,
    Textarea,
    VStack,
    useToast
} from '@chakra-ui/react';
import { Room, RoomStatus, RoomType } from '../../types/room.type';
import { RoomService } from '../../services/room.service';

interface AddRoomDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onRoomAdded: () => void;
    editRoom?: Room;
    hotelId?: number;
}

const initialRoomState: Partial<Room> = {
    number: '',
    name: '',
    type: RoomType.STANDARD,
    price: 0,
    description: '',
    status: RoomStatus.AVAILABLE,
    pictures: [],
};

const AddRoomDialogComponent: React.FC<AddRoomDialogProps> = ({
    isOpen,
    onClose,
    onRoomAdded,
    editRoom,
    hotelId
}) => {
    const [formData, setFormData] = useState<Partial<Room>>(initialRoomState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (editRoom) {
            setFormData(editRoom);
        } else {
            setFormData(initialRoomState);
        }
    }, [editRoom, isOpen]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.number) {
            newErrors.number = 'Room number is required';
        }
        if (!formData.name) {
            newErrors.name = 'Room name is required';
        }
        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }
        if (!formData.type) {
            newErrors.type = 'Room type is required';
        }
        if (!hotelId) {
            newErrors.hotel = 'Hotel ID is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const roomData = {
                ...formData,
                hotel: { id: hotelId },
                status: formData.status || RoomStatus.AVAILABLE,
                pictures: formData.pictures || []
            };

            const savedRoom = editRoom
                ? (editRoom.id 
                    ? await RoomService.updateRoom(editRoom.id, roomData as Room)
                    : await RoomService.createRoom(roomData as Room))
                : await RoomService.createRoom(roomData as Room);

            toast({
                title: 'Success',
                description: `Room ${editRoom ? 'updated' : 'created'} successfully`,
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            onRoomAdded();
            onClose();
            setFormData(initialRoomState);
        } catch (error) {
            console.error('Error saving room:', error);
            toast({
                title: 'Error',
                description: `Failed to ${editRoom ? 'update' : 'create'} room`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value
        }));
        // Clear error when field is modified
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{editRoom ? 'Edit Room' : 'Add New Room'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isInvalid={!!errors.number}>
                            <FormLabel>Room Number</FormLabel>
                            <Input
                                name="number"
                                value={formData.number || ''}
                                onChange={handleChange}
                                placeholder="Enter room number"
                            />
                            <FormErrorMessage>{errors.number}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.name}>
                            <FormLabel>Room Name</FormLabel>
                            <Input
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                                placeholder="Enter room name"
                            />
                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.type}>
                            <FormLabel>Room Type</FormLabel>
                            <Select
                                name="type"
                                value={formData.type || ''}
                                onChange={handleChange}
                            >
                                {Object.values(RoomType).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Select>
                            <FormErrorMessage>{errors.type}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.price}>
                            <FormLabel>Price per Night</FormLabel>
                            <Input
                                name="price"
                                type="number"
                                value={formData.price || ''}
                                onChange={handleChange}
                                placeholder="Enter price per night"
                            />
                            <FormErrorMessage>{errors.price}</FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                name="description"
                                value={formData.description || ''}
                                onChange={handleChange}
                                placeholder="Enter room description"
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Status</FormLabel>
                            <Select
                                name="status"
                                value={formData.status || RoomStatus.AVAILABLE}
                                onChange={handleChange}
                            >
                                {Object.values(RoomStatus).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </Select>
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
                        isLoading={isSubmitting}
                    >
                        {editRoom ? 'Save Changes' : 'Create Room'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export { AddRoomDialogComponent as AddRoomDialog };
