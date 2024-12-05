import React from 'react';
import {
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import Sidebar from '../sidebar/Sidebar';

const Dashboard: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Sidebar />
      <Box
        ml={{ base: '100px', md: '280px' }}
        transition="margin-left 0.3s ease-in-out"
        p="6"
      >
        {/* Dashboard content will go here */}
        <Box>
          <h1>Welcome to Dashboard</h1>
          {/* Add your dashboard widgets and content here */}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
