import { Box, Container, Heading, Text, Button, VStack, Image, Grid } from '@chakra-ui/react';
import { HomeNavBar } from './HomeNavBar';

export const HomePageComponent = () => {
  return (
    <>
      <HomeNavBar />
      <Box as="main">
        {/* Hero Section */}
        <Box
          as="section"
          bgGradient="linear(to-r, brand.600, brand.400)"
          color="white"
          pt={{ base: '120px', md: '130px' }}
          pb={{ base: '64px', md: '80px' }}
        >
          <Container maxW="container.xl" px={4}>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8} alignItems="center">
              <VStack spacing={6} align="flex-start">
                <Heading 
                  as="h1" 
                  fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                  lineHeight="shorter"
                >
                  Welcome to Luxury Stays
                </Heading>
                <Text fontSize={{ base: 'lg', md: 'xl' }} maxW="600px">
                  Experience unparalleled comfort and luxury in our handpicked selection of premium hotels.
                </Text>
                <Button 
                  size="lg" 
                  colorScheme="accent"
                  fontSize="md"
                  px={8}
                >
                  Book Now
                </Button>
              </VStack>
              <Box 
                display={{ base: 'none', md: 'block' }}
                position="relative"
              >
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
                  alt="Luxury Hotel"
                  borderRadius="xl"
                  objectFit="cover"
                  w="full"
                  h="400px"
                  shadow="2xl"
                />
              </Box>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box as="section" py={{ base: '64px', md: '80px' }} bg="bg.default">
          <Container maxW="container.xl" px={4}>
            <Grid 
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} 
              gap={8}
            >
              {/* Feature 1 */}
              <VStack 
                spacing={4} 
                p={8} 
                bg="bg.paper" 
                borderRadius="xl" 
                shadow="lg"
                transition="transform 0.2s"
                _hover={{ transform: 'translateY(-4px)' }}
              >
                <Box color="brand.500" fontSize="4xl">🌟</Box>
                <Heading as="h3" size="md" textAlign="center">
                  Premium Locations
                </Heading>
                <Text textAlign="center" color="text.secondary">
                  Strategically located properties in the heart of your destination.
                </Text>
              </VStack>

              {/* Feature 2 */}
              <VStack 
                spacing={4} 
                p={8} 
                bg="bg.paper" 
                borderRadius="xl" 
                shadow="lg"
                transition="transform 0.2s"
                _hover={{ transform: 'translateY(-4px)' }}
              >
                <Box color="brand.500" fontSize="4xl">🛎️</Box>
                <Heading as="h3" size="md" textAlign="center">
                  24/7 Service
                </Heading>
                <Text textAlign="center" color="text.secondary">
                  Round-the-clock support for all your needs and requests.
                </Text>
              </VStack>

              {/* Feature 3 */}
              <VStack 
                spacing={4} 
                p={8} 
                bg="bg.paper" 
                borderRadius="xl" 
                shadow="lg"
                transition="transform 0.2s"
                _hover={{ transform: 'translateY(-4px)' }}
              >
                <Box color="brand.500" fontSize="4xl">✨</Box>
                <Heading as="h3" size="md" textAlign="center">
                  Luxury Amenities
                </Heading>
                <Text textAlign="center" color="text.secondary">
                  World-class facilities and amenities for your comfort.
                </Text>
              </VStack>
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
};
