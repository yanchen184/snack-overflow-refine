import React from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  useColorModeValue,
  Text,
  MenuDivider,
  Heading,
  Badge,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { User } from "../../interfaces";

/**
 * Header component for the application
 * Contains user profile menu and theme toggle
 */
export const Header: React.FC = () => {
  const { data: user } = useGetIdentity<User>();
  const { mutate: logout } = useLogout();
  const { colorMode, toggleColorMode } = useColorMode();

  // Color scheme based on color mode
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Get current app version
  const appVersion = "1.0.0";

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      py={4}
      px={6}
      bg={bgColor}
      borderBottomWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
    >
      {/* Left side - Mobile menu button */}
      <IconButton
        display={{ base: "flex", md: "none" }}
        aria-label="Open menu"
        variant="outline"
        icon={<HamburgerIcon />}
      />

      {/* Middle - App title and version */}
      <Flex justify="center" flex={1}>
        <Heading size="md">SnackOverFlow</Heading>
        <Badge ml={2} colorScheme="green" alignSelf="center">
          v{appVersion}
        </Badge>
      </Flex>

      {/* Right side - User profile and theme toggle */}
      <HStack spacing={3}>
        {/* Theme toggle button */}
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
        />

        {/* User profile menu */}
        <Menu>
          <MenuButton>
            <Avatar
              size="sm"
              name={user?.firstname ? `${user.firstname} ${user.lastname}` : "User"}
              src="/avatar-placeholder.png"
            />
          </MenuButton>
          <MenuList>
            {user && (
              <>
                <Box px={4} py={2}>
                  <Text fontWeight="medium">{`${user.firstname} ${user.lastname}`}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {user.email}
                  </Text>
                  <Badge mt={1} colorScheme="blue">
                    {user.role}
                  </Badge>
                </Box>
                <MenuDivider />
              </>
            )}
            <MenuItem onClick={() => logout()}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
};
