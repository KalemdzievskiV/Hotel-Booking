import React, { useRef, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Box,
  useToast,
  IconButton,
  HStack,
  Input,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Room } from '../../types/room.type';
import { RoomService } from '../../services/room.service';
import { useNavigate } from 'react-router-dom';

interface RoomDetailsDialogProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

const RoomDetailsDialog: React.FC<RoomDetailsDialogProps> = ({
  room,
  isOpen,
  onClose,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const navigate = useNavigate();

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (room.pictures?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (room.pictures?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    if (!room.id) {
      toast({
        title: 'Error',
        description: 'Room ID is missing',
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

      await RoomService.uploadPictures(room.id, formData);
      
      toast({
        title: 'Success',
        description: 'Pictures uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error uploading pictures:', error);
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

  const handleReserve = () => {
    if (!room.id) {
      toast({
        title: 'Error',
        description: 'Room ID is missing',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    navigate(`/calendar?roomId=${room.id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{room.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Image Carousel */}
            <Box position="relative" height="300px">
              {room.pictures && room.pictures.length > 0 ? (
                <>
                  <Box
                    height="100%"
                    bgImage={`url(${room.pictures[currentImageIndex].url})`}
                    bgSize="cover"
                    bgPosition="center"
                    borderRadius="md"
                  />
                  <IconButton
                    aria-label="Previous image"
                    icon={<ChevronLeftIcon />}
                    position="absolute"
                    left={2}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={handlePrevImage}
                    isDisabled={!room.pictures || room.pictures.length <= 1}
                  />
                  <IconButton
                    aria-label="Next image"
                    icon={<ChevronRightIcon />}
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    onClick={handleNextImage}
                    isDisabled={!room.pictures || room.pictures.length <= 1}
                  />
                </>
              ) : (
                <Box
                  height="100%"
                  bg="gray.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="md"
                >
                  <Text color="gray.500">No images available</Text>
                </Box>
              )}
            </Box>

            {/* Room Information */}
            <VStack align="stretch" spacing={2}>
              <Text><strong>Room Number:</strong> {room.number}</Text>
              <Text><strong>Description:</strong> {room.description}</Text>
              <Text><strong>Status:</strong> {room.status}</Text>
              <Text><strong>Price:</strong> ${room.price}/night</Text>
            </VStack>

            {/* Action Buttons */}
            <HStack spacing={4} justify="space-between">
              <Button onClick={() => fileInputRef.current?.click()} isLoading={uploading}>
                Upload Pictures
              </Button>
              <Input
                type="file"
                multiple
                accept="image/*"
                display="none"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <Button colorScheme="blue" onClick={handleReserve}>
                Reserve
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RoomDetailsDialog;
