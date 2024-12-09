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
    HStack,
    ButtonGroup,
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
    existingReservation?: Reservation;
}

const initialReservationState: Partial<Reservation> = {
    specialRequests: '',
    totalPrice: 0,  // Ensure this is always a number
    status: ReservationStatus.PENDING,
};

const AddReservationDialogComponent: React.FC<AddReservationDialogProps> = ({
    isOpen,
    onClose,
    onReservationAdded,
    selectedRoom,
    selectedStartTime,
    selectedEndTime,
    hotel,
    existingReservation
}) => {
    const [reservation, setReservation] = useState<Partial<Reservation>>(initialReservationState);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [guests, setGuests] = useState<User[]>([]);
    const [isLoadingGuests, setIsLoadingGuests] = useState(false);
    const toast = useToast();
    const [isEditMode, setIsEditMode] = useState(false);

    const formatDateToLocalISOString = (date: string | Date): string => {
        const d = new Date(date);
        const offset = d.getTimezoneOffset();
        const adjustedDate = new Date(d.getTime() - offset * 60 * 1000);
        return adjustedDate.toISOString();
    };

    useEffect(() => {
        if (existingReservation) {
            setReservation({
                ...existingReservation,
                checkInTime: new Date(existingReservation.checkInTime).toISOString().slice(0, 16),
                checkOutTime: new Date(existingReservation.checkOutTime).toISOString().slice(0, 16),
                guest: existingReservation.guest,
                totalPrice: existingReservation.totalPrice,
                specialRequests: existingReservation.specialRequests || '',
                status: existingReservation.status
            });
            setIsEditMode(true);
        } else {
            // Don't convert the dates since they're already in the correct format from the calendar
            setReservation({
                ...initialReservationState,
                checkInTime: selectedStartTime,
                checkOutTime: selectedEndTime,
            });
            setIsEditMode(false);
        }
    }, [existingReservation, selectedStartTime, selectedEndTime]);

    useEffect(() => {
        if (isOpen) {
            fetchGuests();
        }
    }, [isOpen]);

    const fetchGuests = async () => {
        setIsLoadingGuests(true);
        try {
            const allUsers = await UserService.getAllUsers();
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
            const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (!loggedInUser.id || !loggedInUser.role) {
                throw new Error('User not logged in or missing role');
            }

            const reservationData: CreateReservationDTO = {
                room: { id: selectedRoom.id || 0 },
                hotel: { id: hotel.id || 0 },
                guest: { id: reservation.guest?.id || 0 },
                createdBy: { id: loggedInUser.id, role: loggedInUser.role },
                checkInTime: formatDateToLocalISOString(reservation.checkInTime!),
                checkOutTime: formatDateToLocalISOString(reservation.checkOutTime!),
                totalPrice: reservation.totalPrice ?? 0,
                specialRequests: reservation.specialRequests || '',
                status: reservation.status || ReservationStatus.PENDING,
                createdAt: new Date().toISOString()
            };

            if (isEditMode && existingReservation?.id) {
                await ReservationService.updateReservationDTO(existingReservation.id, reservationData);
                toast({
                    title: 'Success',
                    description: 'Reservation updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await ReservationService.createReservation(reservationData);
                toast({
                    title: 'Success',
                    description: 'Reservation created successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            onReservationAdded();
            onClose();
        } catch (error: any) {
            console.error('Error with reservation:', error);
            let errorMessage = `Failed to ${isEditMode ? 'update' : 'create'} reservation. `;
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

    const handleStatusChange = async (newStatus: ReservationStatus) => {
        if (!existingReservation?.id) return;

        setIsSubmitting(true);
        try {
            console.log('Updating reservation status to:', newStatus);
            await ReservationService.updateReservationStatus(existingReservation.id, newStatus);
            toast({
                title: 'Success',
                description: 'Reservation status updated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onReservationAdded(); // Refresh the reservations list
            
            // If the status change affects room availability, close the dialog
            if (newStatus === ReservationStatus.CHECKED_OUT || 
                newStatus === ReservationStatus.CANCELLED) {
                onClose();
            }
        } catch (error: any) {
            console.error('Error updating reservation status:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Failed to update reservation status',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStatusActions = () => {
        if (!isEditMode || !existingReservation) return null;

        const currentStatus = existingReservation.status;
        return (
            <ButtonGroup spacing={2} width="100%" justifyContent="flex-start">
                {currentStatus === ReservationStatus.PENDING && (
                    <Button
                        colorScheme="green"
                        onClick={() => handleStatusChange(ReservationStatus.CONFIRMED)}
                        isLoading={isSubmitting}
                        size="md"
                    >
                        Confirm
                    </Button>
                )}
                {currentStatus === ReservationStatus.CONFIRMED && (
                    <Button
                        colorScheme="blue"
                        onClick={() => handleStatusChange(ReservationStatus.CHECKED_IN)}
                        isLoading={isSubmitting}
                        size="md"
                    >
                        Check In
                    </Button>
                )}
                {currentStatus === ReservationStatus.CHECKED_IN && (
                    <Button
                        colorScheme="purple"
                        onClick={() => handleStatusChange(ReservationStatus.CHECKED_OUT)}
                        isLoading={isSubmitting}
                        size="md"
                    >
                        Check Out
                    </Button>
                )}
                {(currentStatus === ReservationStatus.PENDING || 
                  currentStatus === ReservationStatus.CONFIRMED) && (
                    <Button
                        colorScheme="red"
                        onClick={() => handleStatusChange(ReservationStatus.CANCELLED)}
                        isLoading={isSubmitting}
                        size="md"
                    >
                        Cancel
                    </Button>
                )}
            </ButtonGroup>
        );
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
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {isEditMode ? 'Edit Reservation' : 'Create New Reservation'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl isInvalid={!!errors.room}>
                            <FormLabel>Room</FormLabel>
                            <Input
                                value={`${selectedRoom.number} - ${selectedRoom.name}`}
                                isReadOnly
                            />
                            <FormErrorMessage>{errors.room}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.guest}>
                            <FormLabel>Guest</FormLabel>
                            {isLoadingGuests ? (
                                <Spinner />
                            ) : (
                                <Select
                                    name="guest"
                                    value={reservation.guest?.id}
                                    onChange={handleInputChange}
                                    placeholder="Select guest"
                                    isDisabled={isEditMode}
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
                                type="datetime-local"
                                name="checkInTime"
                                value={reservation.checkInTime?.toString().slice(0, 16) || ''}
                                onChange={handleInputChange}
                            />
                            <FormErrorMessage>{errors.checkInTime}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.checkOutTime}>
                            <FormLabel>Check-out Time</FormLabel>
                            <Input
                                type="datetime-local"
                                name="checkOutTime"
                                value={reservation.checkOutTime?.toString().slice(0, 16) || ''}
                                onChange={handleInputChange}
                            />
                            <FormErrorMessage>{errors.checkOutTime}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.totalPrice}>
                            <FormLabel>Total Price</FormLabel>
                            <Input
                                type="number"
                                name="totalPrice"
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

                <ModalFooter flexDirection="column" gap={4}>
                    {/* Status action buttons */}
                    {renderStatusActions()}
                    
                    {/* Main action buttons */}
                    <ButtonGroup spacing={2} width="100%" justifyContent="flex-end">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            onClick={handleSubmit}
                            isLoading={isSubmitting}
                        >
                            {isEditMode ? 'Update' : 'Create'} Reservation
                        </Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export { AddReservationDialogComponent as AddReservationDialog };
