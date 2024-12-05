import {
  Box,
  Flex,
  Button,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Image,
  Link as ChakraLink,
  Container,
  Text,
  Center,
  HStack,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { ColorModeToggle } from '../ColorModeToggle';
import { MobileNav } from './MobileNav';

export const HomeNavBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 32, 44, 0.95)');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <>
      <Box
        as="nav"
        position="fixed"
        top="0"
        left="0"
        right="0"
        bg={bgColor}
        backdropFilter="blur(10px)"
        borderBottom="1px"
        borderColor={borderColor}
        zIndex={1000}
        boxShadow="sm"
      >
        <Container maxW="container.xl" px={4}>
          <Flex h="70px" alignItems="center" justifyContent="space-between">
            {/* Logo Section */}
            <Link to="/">
              <HStack spacing={2}>
                <Image
                  h="40px"
                  src="/logo.png"
                  alt="Hotel Logo"
                  fallbackSrc="https://via.placeholder.com/40x40"
                />
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={textColor}
                  display={{ base: 'none', md: 'block' }}
                >
                  Luxury Stays
                </Text>
              </HStack>
            </Link>

            {/* Navigation Links - Desktop */}
            <HStack
              spacing={8}
              alignItems="center"
              display={{ base: 'none', md: 'flex' }}
            >
              <ChakraLink
                as={Link}
                to="/"
                fontSize="md"
                fontWeight="500"
                color={textColor}
                _hover={{ color: 'brand.500' }}
                transition="color 0.2s"
              >
                Home
              </ChakraLink>
              <ChakraLink
                as={Link}
                to="/about"
                fontSize="md"
                fontWeight="500"
                color={textColor}
                _hover={{ color: 'brand.500' }}
                transition="color 0.2s"
              >
                About
              </ChakraLink>
              <ChakraLink
                as={Link}
                to="/contact"
                fontSize="md"
                fontWeight="500"
                color={textColor}
                _hover={{ color: 'brand.500' }}
                transition="color 0.2s"
              >
                Contact
              </ChakraLink>
            </HStack>

            {/* Right Section: Theme Toggle & Auth Buttons - Desktop */}
            <HStack spacing={3}>
              <ColorModeToggle />
              <Button
                as={Link}
                to="/login"
                variant="ghost"
                colorScheme="brand"
                h="40px"
                minW="100px"
                fontWeight="500"
                display={{ base: 'none', sm: 'inline-flex' }}
              >
                Log In
              </Button>
              <Button
                as={Link}
                to="/signup"
                colorScheme="brand"
                h="40px"
                minW="100px"
                fontWeight="500"
                display={{ base: 'none', sm: 'inline-flex' }}
              >
                Sign Up
              </Button>

              {/* Mobile Menu Button */}
              <IconButton
                display={{ base: 'inline-flex', sm: 'none' }}
                aria-label="Open menu"
                icon={<HamburgerIcon />}
                onClick={onOpen}
                variant="ghost"
                colorScheme="brand"
                h="40px"
                w="40px"
              />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <MobileNav isOpen={isOpen} onClose={onClose} />
    </>
  );
};
