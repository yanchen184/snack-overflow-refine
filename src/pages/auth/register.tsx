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
import { useRegister } from "@refinedev/core";
import { Link } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

/**
 * Registration form interface
 */
interface IRegisterForm {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Registration page component
 */
export const Register: React.FC = () => {
  const { mutate: register, isLoading, error } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  
  // Form validation and handling
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IRegisterForm>();

  // Watch password field for comparison
  const password = watch("password");

  // Handle form submission
  const onSubmit = (data: IRegisterForm) => {
    const { confirmPassword, ...restData } = data;
    register(restData);
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
        width={{ base: "90%", sm: "450px" }}
      >
        <Stack spacing={6}>
          <Heading textAlign="center" size="xl">
            SnackOverFlow
          </Heading>
          <Heading textAlign="center" size="md">
            Create an Account
          </Heading>

          {/* Display error message if registration fails */}
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {(error as any)?.message || "Registration failed"}
            </Alert>
          )}

          {/* Registration form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              {/* First name field */}
              <FormControl id="firstname" isInvalid={!!errors.firstname}>
                <FormLabel>First Name</FormLabel>
                <Input
                  {...registerForm("firstname", {
                    required: "First name is required",
                  })}
                />
                <FormErrorMessage>{errors.firstname?.message}</FormErrorMessage>
              </FormControl>

              {/* Last name field */}
              <FormControl id="lastname" isInvalid={!!errors.lastname}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  {...registerForm("lastname", {
                    required: "Last name is required",
                  })}
                />
                <FormErrorMessage>{errors.lastname?.message}</FormErrorMessage>
              </FormControl>

              {/* Email field */}
              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...registerForm("email", {
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
                    {...registerForm("password", {
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

              {/* Confirm password field */}
              <FormControl id="confirmPassword" isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...registerForm("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "The passwords do not match",
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
                <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
              </FormControl>

              {/* Submit button */}
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isLoading}
                mt={4}
              >
                Register
              </Button>
            </Stack>
          </form>

          {/* Login link */}
          <Text textAlign="center">
            Already have an account?{" "}
            <ChakraLink as={Link} to="/login" color="blue.500">
              Login
            </ChakraLink>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
};
