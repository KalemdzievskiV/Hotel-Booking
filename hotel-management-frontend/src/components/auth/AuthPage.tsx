import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  InputGroup,
  InputLeftElement,
  Icon,
  Flex,
  Heading,
  VStack,
  useColorModeValue,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, ViewIcon, ArrowBackIcon, PhoneIcon } from '@chakra-ui/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService, { LoginRequest, SignupRequest } from '../../services/auth.service';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionContainer = motion(Container);

interface FormData extends SignupRequest {
  confirmPassword?: string;
}

export const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      if (isSignIn) {
        const loginData: LoginRequest = {
          email: formData.email,
          password: formData.password,
        };
        await AuthService.login(loginData);
        toast({
          title: 'Login Successful',
          status: 'success',
          duration: 3000,
        });
        navigate('/dashboard');
      } else {
        const signupData: SignupRequest = {
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
        };
        await AuthService.signup(signupData);
        toast({
          title: 'Account Created Successfully',
          status: 'success',
          duration: 3000,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial animation
    setTimeout(() => {
      setIsSignIn(true);
    }, 200);
  }, []);

  const bgGradient = useColorModeValue(
    'linear(to-r, brand.500, accent.500)',
    'linear(to-r, brand.600, accent.600)'
  );
  const formBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <Box
      h="100vh"
      w="100vw"
      overflow="hidden"
      position="relative"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      {/* Home Button */}
      <Box
        position="absolute"
        top={4}
        left={4}
        zIndex={10}
      >
        <Tooltip label="Back to Home" placement="right">
          <IconButton
            icon={<ArrowBackIcon boxSize={6} />}
            aria-label="Back to Home"
            onClick={() => navigate('/')}
            size="lg"
            variant="solid"
            bg={useColorModeValue('white', 'gray.800')}
            color={textColor}
            boxShadow="md"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            _active={{
              transform: 'translateY(0)',
              boxShadow: 'md',
            }}
            transition="all 0.2s"
          />
        </Tooltip>
      </Box>

      {/* Background Gradient */}
      <MotionBox
        position="absolute"
        top="0"
        right="0"
        height="100vh"
        width="300vw"
        bgGradient={bgGradient}
        initial={false}
        animate={{
          transform: isSignIn
            ? 'translate(0, 0)'
            : 'translate(100%, 0)',
          right: '50%',
        }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        borderBottomRightRadius={['0', '0', '50vw']}
        borderTopLeftRadius={['0', '0', '50vw']}
        zIndex={0}
      />

      {/* Content Container */}
      <Flex h="100vh" position="relative" zIndex={1}>
        {/* Form Section */}
        <AnimatePresence mode="wait">
          <MotionContainer
            key={isSignIn ? 'signin' : 'signup'}
            maxW="container.lg"
            h="100%"
            initial={{ opacity: 0, x: isSignIn ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSignIn ? -50 : 50 }}
            transition={{ duration: 0.5 }}
          >
            <Flex h="100%" align="center" justify="center">
              <VStack
                spacing={8}
                w="full"
                maxW="md"
                bg={formBg}
                p={8}
                borderRadius="xl"
                boxShadow="xl"
                position="relative"
              >
                <Heading
                  size="xl"
                  color={textColor}
                  mb={2}
                >
                  {isSignIn ? 'Welcome Back' : 'Create Account'}
                </Heading>

                <VStack spacing={4} w="full">
                  {!isSignIn && (
                    <>
                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <ViewIcon color={iconColor} />
                          </InputLeftElement>
                          <Input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Username"
                            bg={inputBg}
                            size="lg"
                            borderRadius="md"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <ViewIcon color={iconColor} />
                          </InputLeftElement>
                          <Input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First Name"
                            bg={inputBg}
                            size="lg"
                            borderRadius="md"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <ViewIcon color={iconColor} />
                          </InputLeftElement>
                          <Input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                            bg={inputBg}
                            size="lg"
                            borderRadius="md"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <PhoneIcon color={iconColor} />
                          </InputLeftElement>
                          <Input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="Phone Number"
                            bg={inputBg}
                            size="lg"
                            borderRadius="md"
                          />
                        </InputGroup>
                      </FormControl>
                    </>
                  )}

                  <FormControl>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <EmailIcon color={iconColor} />
                      </InputLeftElement>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        bg={inputBg}
                        size="lg"
                        borderRadius="md"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <LockIcon color={iconColor} />
                      </InputLeftElement>
                      <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        bg={inputBg}
                        size="lg"
                        borderRadius="md"
                      />
                    </InputGroup>
                  </FormControl>

                  {!isSignIn && (
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <LockIcon color={iconColor} />
                        </InputLeftElement>
                        <Input
                          type="password"
                          placeholder="Confirm Password"
                          bg={inputBg}
                          size="lg"
                          borderRadius="md"
                        />
                      </InputGroup>
                    </FormControl>
                  )}

                  <Button
                    w="full"
                    size="lg"
                    bgGradient={bgGradient}
                    color="white"
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    _hover={{
                      bgGradient: 'linear(to-r, brand.600, accent.600)',
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                    _active={{
                      bgGradient: 'linear(to-r, brand.700, accent.700)',
                      transform: 'translateY(0)',
                    }}
                    transition="all 0.2s"
                  >
                    {isSignIn ? 'Sign In' : 'Sign Up'}
                  </Button>

                  {isSignIn && (
                    <Button 
                      variant="ghost" 
                      color="brand.500" 
                      size="sm"
                      fontWeight="medium"
                      px={2}
                      height="auto"
                      _hover={{
                        bg: 'transparent',
                        color: 'brand.600',
                        transform: 'translateY(-1px)',
                      }}
                      _active={{
                        bg: 'transparent',
                        transform: 'translateY(0)',
                      }}
                      transition="all 0.2s"
                    >
                      Forgot password?
                    </Button>
                  )}

                  <Flex
                    w="full"
                    justify="center"
                    align="center"
                    mt={2}
                    borderTop="1px"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    pt={4}
                  >
                    <Text fontSize="sm" color={textColor}>
                      {isSignIn ? "Don't have an account?" : "Already have an account?"}
                    </Text>
                    <Button
                      variant="ghost"
                      color="brand.500"
                      ml={2}
                      onClick={toggleMode}
                      fontWeight="semibold"
                      px={2}
                      height="auto"
                      _hover={{
                        bg: 'transparent',
                        color: 'brand.600',
                        transform: 'translateY(-1px)',
                      }}
                      _active={{
                        bg: 'transparent',
                        transform: 'translateY(0)',
                      }}
                      transition="all 0.2s"
                    >
                      {isSignIn ? 'Sign up' : 'Sign in'}
                    </Button>
                  </Flex>
                </VStack>
              </VStack>
            </Flex>
          </MotionContainer>
        </AnimatePresence>

        {/* Welcome Text - Desktop Only */}
        <MotionFlex
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          pointerEvents="none"
          align="center"
          justify="center"
          zIndex={2}
          display={{ base: "none", md: "flex" }}
        >
          <MotionBox
            initial={false}
            animate={{
              x: isSignIn ? '0%' : '100%',
              opacity: isSignIn ? 1 : 0,
            }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            color="white"
            textAlign="center"
            w="50%"
          >
            <Heading size="2xl" fontWeight="800">
              {isSignIn ? 'Welcome Back!' : ''}
            </Heading>
          </MotionBox>
          <MotionBox
            initial={false}
            animate={{
              x: isSignIn ? '100%' : '0%',
              opacity: isSignIn ? 0 : 1,
            }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            color="white"
            textAlign="center"
            w="50%"
          >
            <Heading size="2xl" fontWeight="800">
              {!isSignIn ? 'Join with us!' : ''}
            </Heading>
          </MotionBox>
        </MotionFlex>
      </Flex>
    </Box>
  );
};

export default AuthPage;
