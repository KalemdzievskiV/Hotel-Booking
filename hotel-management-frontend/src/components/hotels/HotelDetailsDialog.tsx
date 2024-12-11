import React, { useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  HStack,
  Image,
  SimpleGrid,
  Icon,
  Input,
  useToast,
} from '@chakra-ui/react';
import { FiPhone, FiMail, FiMapPin, FiUpload } from 'react-icons/fi';
import { Hotel } from '../../types/hotel.type';
import { HotelService } from '../../services/hotel.service';

interface HotelDetailsDialogProps {
  hotel: Hotel;
  isOpen: boolean;
  onClose: () => void;
}

const HotelDetailsDialog: React.FC<HotelDetailsDialogProps> = ({
  hotel,
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!hotel.id) {
      toast({
        title: 'Error',
        description: 'Hotel ID is missing',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('pictures', file);
      });

      // Update this to match your backend endpoint for uploading hotel pictures
      const updatedHotel = await HotelService.uploadPictures(hotel.id, formData);
      
      toast({
        title: 'Success',
        description: 'Pictures uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // You might want to refresh the hotel data here
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload pictures',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{hotel.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Hotel Images */}
            <SimpleGrid columns={[1, 2, 3]} spacing={4} mb={4}>
              {hotel.pictures.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  alt={`${hotel.name} - Image ${index + 1}`}
                  objectFit="cover"
                  height="150px"
                  rounded="md"
                />
              ))}
            </SimpleGrid>

            {/* Hotel Details */}
            <VStack align="stretch" spacing={3}>
              <HStack>
                <Icon as={FiMapPin} />
                <Text>{hotel.address}</Text>
              </HStack>
              <HStack>
                <Icon as={FiPhone} />
                <Text>{hotel.phoneNumber}</Text>
              </HStack>
              <HStack>
                <Icon as={FiMail} />
                <Text>{hotel.email}</Text>
              </HStack>
              <Text>{hotel.description}</Text>
            </VStack>

            {/* Upload Pictures Section */}
            <Input
              type="file"
              multiple
              accept="image/*"
              display="none"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            leftIcon={<FiUpload />}
            colorScheme="blue"
            mr={3}
            onClick={() => fileInputRef.current?.click()}
            isLoading={uploading}
          >
            Upload Pictures
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HotelDetailsDialog;
