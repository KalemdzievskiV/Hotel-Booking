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
    useToast,
    Spinner,
} from '@chakra-ui/react';
import { Reservation, ReservationStatus, CreateReservationDTO } from '../../types/reservation.type';
import { ReservationService } from '../../services/reservation.service';
import { UserService } from '../../services/user.service';
import { Room } from '../../types/room.type';
import { Hotel } from '../../types/hotel.type';
import { User, UserRole } from '../../types/user.type';

interface AddReservationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onReservationAdded: () => void;
    selectedRoom: Room;
    selectedStartTime: string;
    selectedEndTime: string;
    hotel: Hotel;
}

const initialReservationState: Partial<Reservation> = {
    specialRequests: '',
    totalPrice: 0,
};

const AddReservationDialogComponent: React.FC<AddReservationDialogProps> = ({
    isOpen,
    onClose,
    onReservationAdded,
    selectedRoom,
    selectedStartTime,
    selectedEndTime,
    hotel
}) => {
    const [reservation, setReservation] = useState<Partial<Reservation>>(initialReservationState);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [guests, setGuests] = useState<User[]>([]);
    const [isLoadingGuests, setIsLoadingGuests] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            setReservation({
                ...initialReservationState,
                room: selectedRoom,
                hotel: hotel,
                checkInTime: selectedStartTime,
                checkOutTime: selectedEndTime,
                totalPrice: 0,
            });
            fetchGuests();
        }
    }, [isOpen, selectedRoom, hotel, selectedStartTime, selectedEndTime]);

    const fetchGuests = async () => {
        setIsLoadingGuests(true);
        try {
            const allUsers = await UserService.getAllUsers();
            // Filter only guest users
            const guestUsers = allUsers.filter(user => user.role === UserRole.GUEST);
            setGuests(guestUsers);
        } catch (error) {
            console.error('Error fetching guests:', error);
            toast({
                title: 'Error',
                description: 'Failed to load guests',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoadingGuests(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!reservation.guest) {
            newErrors.guest = 'Guest selection is required';
        }
        if (!reservation.checkInTime) {
            newErrors.checkInTime = 'Check-in time is required';
        }
        if (!reservation.checkOutTime) {
            newErrors.checkOutTime = 'Check-out time is required';
        }
        if (reservation.totalPrice === undefined || reservation.totalPrice <= 0) {
            newErrors.totalPrice = 'Valid total price is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const newReservation: CreateReservationDTO = {
                room: { id: parseInt(selectedRoom.id?.toString() ?? '0') },
                hotel: { id: parseInt(hotel.id?.toString() ?? '0') },
                guest: { id: parseInt(reservation.guest?.id?.toString() ?? '0') },
                checkInTime: new Date(selectedStartTime).toISOString().split('T')[0] + 'T' + new Date(selectedStartTime).toTimeString().split(' ')[0],
                checkOutTime: new Date(selectedEndTime).toISOString().split('T')[0] + 'T' + new Date(selectedEndTime).toTimeString().split(' ')[0],
                totalPrice: reservation.totalPrice ?? 0,
                specialRequests: reservation.specialRequests || '',
                status: ReservationStatus.PENDING
            };

            await ReservationService.createReservation(newReservation);
            toast({
                title: 'Success',
                description: 'Reservation created successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onReservationAdded();
            onClose();
        } catch (error: any) {
            console.error('Error creating reservation:', error);
            let errorMessage = 'Failed to create reservation. ';
            if (error.response?.data?.message) {
                errorMessage += error.response.data.message;
            } else {
                errorMessage += 'Please try again.';
            }
            toast({
                title: 'Error',
                description: errorMessage,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (name === 'guest') {
            const selectedGuest = guests.find(g => g.id === parseInt(value));
            setReservation(prev => ({
                ...prev,
                guest: selectedGuest
            }));
        } else {
            setReservation(prev => ({
                ...prev,
                [name]: name === 'totalPrice' ? parseFloat(value) : value
            }));
        }
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create New Reservation</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isInvalid={!!errors.room}>
                            <FormLabel>Room</FormLabel>
                            <Input
                                value={`${selectedRoom.number} - ${selectedRoom.name}`}
                                isReadOnly
                            />
                        </FormControl>

                        <FormControl isInvalid={!!errors.guest}>
                            <FormLabel>Guest</FormLabel>
                            {isLoadingGuests ? (
                                <Spinner size="sm" />
                            ) : (
                                <Select
                                    name="guest"
                                    value={reservation.guest?.id || ''}
                                    onChange={handleInputChange}
                                    placeholder="Select guest"
                                >
                                    {guests.map(guest => (
                                        <option key={guest.id} value={guest.id}>
                                            {guest.firstName} {guest.lastName} ({guest.email})
                                        </option>
                                    ))}
                                </Select>
                            )}
                            <FormErrorMessage>{errors.guest}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.checkInTime}>
                            <FormLabel>Check-in Time</FormLabel>
                            <Input
                                name="checkInTime"
                                value={new Date(selectedStartTime).toLocaleString()}
                                isReadOnly
                            />
                            <FormErrorMessage>{errors.checkInTime}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.checkOutTime}>
                            <FormLabel>Check-out Time</FormLabel>
                            <Input
                                name="checkOutTime"
                                value={new Date(selectedEndTime).toLocaleString()}
                                isReadOnly
                            />
                            <FormErrorMessage>{errors.checkOutTime}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.totalPrice}>
                            <FormLabel>Total Price</FormLabel>
                            <Input
                                name="totalPrice"
                                type="number"
                                value={reservation.totalPrice || ''}
                                onChange={handleInputChange}
                                placeholder="Enter total price"
                            />
                            <FormErrorMessage>{errors.totalPrice}</FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Special Requests</FormLabel>
                            <Textarea
                                name="specialRequests"
                                value={reservation.specialRequests || ''}
                                onChange={handleInputChange}
                                placeholder="Enter any special requests"
                            />
                        </FormControl>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                    >
                        Create Reservation
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export { AddReservationDialogComponent as AddReservationDialog };
