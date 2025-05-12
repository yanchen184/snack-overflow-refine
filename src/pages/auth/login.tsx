import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Link as ChakraLink,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useLogin } from "@refinedev/core";
import { Link } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

/**
 * Login form interface
 */
interface ILoginForm {
  email: string;
  password: string;
}

/**
 * Login page component
 */
export const Login: React.FC = () => {
  const { mutate: login, isLoading, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  
  // Form validation and handling
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();

  // Handle form submission
  const onSubmit = (data: ILoginForm) => {
    login(data);
  };

  // Toggle password visibility
  const handleTogglePassword = () => setShowPassword(!showPassword);

  // Background colors
  const bgColor = useColorModeValue("white", "gray.800");
  const boxShadow = useColorModeValue("lg", "dark-lg");

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue("gray.50", "gray.900")}
      p={4}
    >
      <Box
        bg={bgColor}
        borderRadius="lg"
        boxShadow={boxShadow}
        p={8}
        width={{ base: "90%", sm: "400px" }}
      >
        <Stack spacing={6}>
          <Heading textAlign="center" size="xl">
            SnackOverFlow
          </Heading>
          <Heading textAlign="center" size="md">
            Login
          </Heading>

          {/* Display error message if login fails */}
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {(error as any)?.message || "Login failed"}
            </Alert>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              {/* Email field */}
              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              {/* Password field */}
              <FormControl id="password" isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={handleTogglePassword}
                      variant="ghost"
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              {/* Submit button */}
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isLoading}
                mt={4}
              >
                Login
              </Button>
            </Stack>
          </form>

          {/* Registration link */}
          <Text textAlign="center">
            Don't have an account?{" "}
            <ChakraLink as={Link} to="/register" color="blue.500">
              Register
            </ChakraLink>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};
