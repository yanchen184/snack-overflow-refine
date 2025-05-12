import React from "react";
import {
  Box,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  Icon,
  IconButton,
  Link,
  Text,
  useColorModeValue,
  useDisclosure,
  BoxProps,
  FlexProps,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiShoppingBag, FiUsers, FiCalendar, FiList, FiTag } from "react-icons/fi";
import { IconType } from "react-icons";
import { useGetIdentity } from "@refinedev/core";
import { User } from "../../interfaces";

// Navigation item interface
interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
  path: string;
}

// Sidebar contents interface
interface SidebarContentProps extends BoxProps {
  onClose: () => void;
}

// Navigation items
const navItems = [
  { name: "Dashboard", icon: FiHome, path: "/" },
  { name: "Products", icon: FiShoppingBag, path: "/products" },
  { name: "Product Classes", icon: FiTag, path: "/product-classes" },
  { name: "Bookings", icon: FiCalendar, path: "/bookings" },
  { name: "Members", icon: FiUsers, path: "/members" },
];

/**
 * Navigation item component
 */
const NavItem = ({ icon, children, path, ...rest }: NavItemProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = location.pathname === path;
  
  // Color scheme based on active state
  const activeBg = useColorModeValue("blue.50", "blue.900");
  const inactiveBg = useColorModeValue("transparent", "transparent");
  const activeColor = useColorModeValue("blue.600", "blue.200");
  const inactiveColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Link
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      onClick={() => navigate(path)}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? activeBg : inactiveBg}
        color={isActive ? activeColor : inactiveColor}
        fontWeight={isActive ? "bold" : "normal"}
        _hover={{
          bg: activeBg,
          color: activeColor,
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

/**
 * Sidebar content component
 */
const SidebarContent = ({ onClose, ...rest }: SidebarContentProps) => {
  const { data: user } = useGetIdentity<User>();
  
  // Filter navigation items based on user role
  const filteredNavItems = React.useMemo(() => {
    if (!user) return [];
    
    // Admin can see all items
    if (user.role === "ROLE_ADMIN") {
      return navItems;
    }
    
    // Manager can see most items except sensitive ones
    if (user.role === "ROLE_MANAGER") {
      return navItems.filter(item => item.name !== "Members");
    }
    
    // Regular user can only see basic items
    return navItems.filter(item => 
      ["Dashboard", "Products", "Bookings"].includes(item.name)
    );
  }, [user]);

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          SnackOF
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      
      {/* Navigation items */}
      {filteredNavItems.map((item) => (
        <NavItem key={item.name} icon={item.icon} path={item.path}>
          {item.name}
        </NavItem>
      ))}
    </Box>
  );
};

/**
 * Sidebar component with mobile responsive drawer
 */
export const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      {/* Mobile drawer */}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      
      {/* Desktop sidebar */}
      <SidebarContent display={{ base: "none", md: "block" }} onClose={() => {}} />
      
      {/* Mobile nav button */}
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<HamburgerIcon />}
        position="fixed"
        top="4"
        left="4"
        zIndex="1"
      />
    </Box>
  );
};
