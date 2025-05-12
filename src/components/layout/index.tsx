import React from "react";
import { 
  Box, 
  Flex, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  useColorMode, 
  useColorModeValue, 
  Heading 
} from "@chakra-ui/react";
import { 
  HamburgerIcon, 
  MoonIcon, 
  SunIcon 
} from "@chakra-ui/icons";
import { useLogout, useGetIdentity } from "@refinedev/core";
import { Header } from "../header";
import { Sidebar } from "../sidebar";

/**
 * Main layout component that wraps all pages
 * Includes header, sidebar and main content area
 */
export const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { data: user } = useGetIdentity();
  const { mutate: logout } = useLogout();
  const { colorMode, toggleColorMode } = useColorMode();
  
  // Color scheme based on color mode
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");

  // Handle user logout
  const handleLogout = () => {
    logout();
  };

  return (
    <Box minH="100vh" bg={bgColor} color={textColor}>
      <Sidebar />
      
      {/* Main content area */}
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
        <Header />
        
        {/* Page content */}
        <Box p="4">
          {children}
        </Box>
      </Box>
    </Box>
  );
};
