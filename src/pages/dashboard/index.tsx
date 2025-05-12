import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  useColorModeValue,
  Skeleton,
  Flex,
  Badge,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
} from "@chakra-ui/react";
import { useCustom, useGetIdentity, useNavigation, useList } from "@refinedev/core";
import { FiShoppingBag, FiUsers, FiCalendar } from "react-icons/fi";
import { User, Product, BookingData } from "../../interfaces";
import dayjs from "dayjs";

/**
 * Dashboard page component
 * Shows overview statistics and recent activity
 */
export const Dashboard: React.FC = () => {
  const { data: user } = useGetIdentity<User>();
  const { show } = useNavigation();
  
  // Fetch recent products
  const { data: recentProducts, isLoading: isProductsLoading } = useList({
    resource: "/products",
    pagination: {
      pageSize: 5,
    },
    sorters: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
  });

  // Fetch recent bookings
  const { data: recentBookings, isLoading: isBookingsLoading } = useList({
    resource: "/bookings",
    pagination: {
      pageSize: 5,
    },
    sorters: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
  });

  // Statistic values (in a real app, these would come from API calls)
  const productCount = recentProducts?.data?.length || 0;
  const bookingCount = recentBookings?.data?.length || 0;
  const memberCount = 10; // Sample value, would come from API

  // Background colors
  const cardBg = useColorModeValue("white", "gray.800");
  const statBg = useColorModeValue("blue.50", "blue.900");
  const statColor = useColorModeValue("blue.600", "blue.200");

  return (
    <Box>
      {/* Dashboard header */}
      <Box mb={8}>
        <Heading size="lg">Dashboard</Heading>
        <Text color="gray.500" mt={1}>
          Welcome back, {user?.firstname ? `${user.firstname} ${user.lastname}` : "User"}!
        </Text>
      </Box>

      {/* Statistics cards */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        {/* Products card */}
        <Card bg={cardBg} boxShadow="md">
          <CardBody>
            <Stat>
              <Flex justify="space-between" align="center">
                <Box>
                  <StatLabel>Products</StatLabel>
                  <Skeleton isLoaded={!isProductsLoading}>
                    <StatNumber>{productCount}</StatNumber>
                  </Skeleton>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Recent products
                  </StatHelpText>
                </Box>
                <Flex
                  bg={statBg}
                  color={statColor}
                  p={3}
                  borderRadius="full"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiShoppingBag} boxSize={5} />
                </Flex>
              </Flex>
            </Stat>
          </CardBody>
        </Card>

        {/* Bookings card */}
        <Card bg={cardBg} boxShadow="md">
          <CardBody>
            <Stat>
              <Flex justify="space-between" align="center">
                <Box>
                  <StatLabel>Bookings</StatLabel>
                  <Skeleton isLoaded={!isBookingsLoading}>
                    <StatNumber>{bookingCount}</StatNumber>
                  </Skeleton>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Recent activity
                  </StatHelpText>
                </Box>
                <Flex
                  bg={statBg}
                  color={statColor}
                  p={3}
                  borderRadius="full"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiCalendar} boxSize={5} />
                </Flex>
              </Flex>
            </Stat>
          </CardBody>
        </Card>

        {/* Members card */}
        <Card bg={cardBg} boxShadow="md">
          <CardBody>
            <Stat>
              <Flex justify="space-between" align="center">
                <Box>
                  <StatLabel>Members</StatLabel>
                  <StatNumber>{memberCount}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Active users
                  </StatHelpText>
                </Box>
                <Flex
                  bg={statBg}
                  color={statColor}
                  p={3}
                  borderRadius="full"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiUsers} boxSize={5} />
                </Flex>
              </Flex>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Recent activity section */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Recent products */}
        <Card bg={cardBg} boxShadow="md">
          <CardBody>
            <Heading size="md" mb={4}>
              Recent Products
            </Heading>
            
            <TableContainer>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th isNumeric>Price</Th>
                    <Th>Class</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {isProductsLoading ? (
                    <Tr>
                      <Td colSpan={4}>
                        <Skeleton height="20px" />
                      </Td>
                    </Tr>
                  ) : (
                    recentProducts?.data?.map((product: Product) => (
                      <Tr key={product.id}>
                        <Td>{product.name}</Td>
                        <Td isNumeric>{product.price}</Td>
                        <Td>
                          <Badge colorScheme="blue">{product.productClass?.name}</Badge>
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => show("products", product.id)}
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        {/* Recent bookings */}
        <Card bg={cardBg} boxShadow="md">
          <CardBody>
            <Heading size="md" mb={4}>
              Recent Bookings
            </Heading>
            
            <TableContainer>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Member</Th>
                    <Th>Date</Th>
                    <Th isNumeric>Total</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {isBookingsLoading ? (
                    <Tr>
                      <Td colSpan={4}>
                        <Skeleton height="20px" />
                      </Td>
                    </Tr>
                  ) : (
                    recentBookings?.data?.map((booking: BookingData) => (
                      <Tr key={booking.id}>
                        <Td>{booking.memberName}</Td>
                        <Td>{dayjs(booking.date).format("YYYY-MM-DD")}</Td>
                        <Td isNumeric>{booking.totalAmount}</Td>
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => show("bookings", booking.id)}
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};
