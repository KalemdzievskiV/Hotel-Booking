import {
  VStack,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="full">
      <DrawerOverlay />
      <DrawerContent bg={bgColor}>
        <DrawerCloseButton 
          size="lg"
          color={textColor}
          _hover={{
            bg: useColorModeValue('gray.100', 'gray.700'),
          }}
        />
        <DrawerHeader borderBottomWidth="1px">
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Menu
          </Text>
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={4} align="stretch" mt={8}>
            <Button
              as={Link}
              to="/"
              variant="ghost"
              size="lg"
              onClick={onClose}
              justifyContent="flex-start"
              height="48px"
            >
              Home
            </Button>
            <Button
              as={Link}
              to="/about"
              variant="ghost"
              size="lg"
              onClick={onClose}
              justifyContent="flex-start"
              height="48px"
            >
              About
            </Button>
            <Button
              as={Link}
              to="/contact"
              variant="ghost"
              size="lg"
              onClick={onClose}
              justifyContent="flex-start"
              height="48px"
            >
              Contact
            </Button>
            <Button
              as={Link}
              to="/login"
              variant="ghost"
              colorScheme="brand"
              size="lg"
              onClick={onClose}
              justifyContent="flex-start"
              height="48px"
            >
              Log In
            </Button>
            <Button
              as={Link}
              to="/signup"
              colorScheme="brand"
              size="lg"
              onClick={onClose}
              justifyContent="flex-start"
              height="48px"
            >
              Sign Up
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
