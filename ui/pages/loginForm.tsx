/* eslint-disable no-console */
import { Box, Button, Input, FormControl, FormLabel, Heading, VStack } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState, useCallback } from 'react';

import config from 'configs/app/index';
import { useAuth } from 'lib/contexts/auth';
import Toast from 'ui/shared/chakra/Toast'; // Correct import

const Login = () => {
  const { login } = useAuth();
  const [ username, setUsername ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ toastMessage, setToastMessage ] = useState<{
    title: string;
    description: string;
    status: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleSubmit = useCallback(async() => {
    if (!username || !password) {
      setToastMessage({
        title: 'Error',
        description: 'Please enter both username and password.',
        status: 'error',
      });
      return;
    }

    try {
      console.log('Logging in with:', { username, password });
      const authUrl = config.api.authUrl;
      if (!authUrl) {
        throw new Error('Auth URL is not defined in environment variables');
      }

      const response = await axios.post(authUrl, {
        Username: username,
        Password: password,
      });

      // On success, the API returns:
      // { statusCode: 200, message: "OK" }
      if (response.status === 200 && response.data.statusCode === 200) {
        setToastMessage({
          title: 'Success',
          description: 'Logged in successfully!',
          status: 'success',
        });
        // Call your auth context login function on success
        login();
      } else {
        setToastMessage({
          title: 'Error',
          description: response.data.message || 'Invalid login credentials.',
          status: 'error',
        });
      }
    } catch (error: unknown) {
      console.error('Error during login:', error);
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        const errMsg = (error.response.data as { message?: string }).message || 'An error occurred. Please try again later.';
        setToastMessage({
          title: 'Error',
          description: errMsg,
          status: 'error',
        });
      } else if (error instanceof Error) {
        setToastMessage({
          title: 'Error',
          description: error.message,
          status: 'error',
        });
      } else {
        setToastMessage({
          title: 'Error',
          description: 'An unknown error occurred. Please try again later.',
          status: 'error',
        });
      }
    }
  }, [ username, password, login ]);

  const handleCloseToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  return (
    <Box maxWidth="400px" mx="auto" mt="10" p="6" borderWidth="1px" borderRadius="md">
      <Heading as="h2" size="lg" mb="6" textAlign="center">
        Login
      </Heading>

      { toastMessage && (
        <Toast
          title={ toastMessage.title }
          description={ toastMessage.description }
          status={ toastMessage.status }
          isClosable={ true }
          onClose={ handleCloseToast }
        />
      ) }

      <VStack spacing="4">
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="Enter your username"
            value={ username }
            onChange={ handleUsernameChange }
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={ password }
            onChange={ handlePasswordChange }
          />
        </FormControl>

        <Button colorScheme="cyan" width="full" onClick={ handleSubmit }>
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
