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
  Textarea,
  useToast,
  FormErrorMessage,
  Checkbox,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { HotelService } from '../../services/hotel.service';
import AuthService, { LoginResponse } from '../../services/auth.service';
import { Hotel } from '../../types/hotel.type';

interface AddHotelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onHotelAdded: () => void;
  onHotelCreated?: () => void;
}

const AMENITIES = [
  'WiFi',
  'Parking',
  'Pool',
  'Gym',
  'Restaurant',
  'Room Service',
  'Spa',
  'Bar',
  'Conference Room',
  'Business Center',
];

const AddHotelDialog: React.FC<AddHotelDialogProps> = ({
  isOpen,
  onClose,
  onHotelAdded,
  onHotelCreated,
}) => {
  const [formData, setFormData] = useState<Partial<Hotel>>({
    name: '',
    address: '',
    description: '',
    phoneNumber: '',
    email: '',
    starRating: 3,
    amenities: [],
    pictures: [],
    averageRating: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const userData = AuthService.getCurrentUser();
      console.log('Current user data:', userData);

      if (!userData) {
        console.log('No user data returned from getCurrentUser');
        toast({
          title: 'Error',
          description: 'User not found. Please log in again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!userData.id) {
        console.log('No user ID found in user data');
        toast({
          title: 'Error',
          description: 'User ID not found. Please log in again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Create hotel with admin_id from the logged-in user
      const hotelData: Hotel = {
        ...formData as Hotel,
        admin_id: Number(userData.id)
      };
      
      console.log('Final hotel data to be sent:', JSON.stringify(hotelData, null, 2));
      
      try {
        const createdHotel = await HotelService.createHotel(hotelData);
        console.log('Hotel created successfully:', createdHotel);
        
        toast({
          title: 'Success',
          description: 'Hotel created successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        onClose();
        // Trigger refetch of hotels
        if (onHotelCreated) {
          onHotelCreated();
        }
      } catch (error: any) {
        console.error('Error creating hotel:', {
          error,
          response: error.response?.data,
          status: error.response?.status
        });
        
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to create hotel. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error creating hotel:', error);
      toast({
        title: 'Error adding hotel',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...(prev.amenities || []), amenity],
    }));
  };

  if (errors.general) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color="red.500">{errors.general}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Hotel</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Hotel Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter hotel name"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.address}>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter hotel address"
              />
              <FormErrorMessage>{errors.address}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter hotel description"
              />
            </FormControl>

            <FormControl isInvalid={!!errors.phoneNumber}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
              <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Star Rating</FormLabel>
              <Select
                name="starRating"
                value={formData.starRating?.toString()}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    starRating: parseInt(e.target.value, 10),
                  }))
                }
              >
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Amenities</FormLabel>
              <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                {AMENITIES.map((amenity) => (
                  <Checkbox
                    key={amenity}
                    isChecked={formData.amenities?.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  >
                    {amenity}
                  </Checkbox>
                ))}
              </SimpleGrid>
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
            Add Hotel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddHotelDialog;
