import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Skeleton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge,
  useColorModeValue,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
} from "@chakra-ui/react";
import { 
  SearchIcon, 
  AddIcon, 
  ChevronDownIcon, 
  ViewIcon, 
  EditIcon, 
  DeleteIcon 
} from "@chakra-ui/icons";
import {
  useDelete,
  useNavigation,
  useTable,
  useGetIdentity,
} from "@refinedev/core";
import { BookingData, User } from "../../interfaces";
import dayjs from "dayjs";

/**
 * Booking list page component
 */
export const BookingList: React.FC = () => {
  const toast = useToast();
  const { data: user } = useGetIdentity<User>();
  const { show, create, edit } = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // Table hook for bookings
  const {
    tableQueryResult: { data, isLoading, isError },
    current,
    setCurrent,
    pageCount,
    filters,
    setFilters,
    setSorters,
  } = useTable<BookingData>({
    resource: "/bookings",
    pagination: {
      pageSize: 10,
    },
    sorters: {
      initial: [{ field: "id", order: "desc" }],
    },
  });

  // Delete hook
  const { mutate: deleteBooking, isLoading: isDeleting } = useDelete();

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    
    // Set filter for member name
    const newFilters = [
      {
        field: "member",
        operator: "eq",
        value: e.target.value !== "" ? e.target.value : undefined,
      },
    ];
    
    // Add month filter if selected
    if (selectedMonth) {
      newFilters.push({
        field: "month",
        operator: "eq",
        value: selectedMonth,
      });
    }
    
    setFilters(newFilters);
  };

  // Handle month filter change
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    
    // Set filters
    const newFilters = [
      {
        field: "month",
        operator: "eq",
        value: e.target.value !== "" ? e.target.value : undefined,
      },
    ];
    
    // Add search term filter if entered
    if (searchTerm) {
      newFilters.push({
        field: "member",
        operator: "eq",
        value: searchTerm,
      });
    }
    
    setFilters(newFilters);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteItemId) {
      deleteBooking(
        {
          resource: "/bookings",
          id: deleteItemId,
        },
        {
          onSuccess: () => {
            setIsDeleteDialogOpen(false);
            toast({
              title: "Booking deleted",
              description: "The booking has been deleted successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          },
          onError: (error) => {
            setIsDeleteDialogOpen(false);
            toast({
              title: "Error",
              description: "There was an error deleting the booking",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          },
        }
      );
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id: number) => {
    setDeleteItemId(id);
    setIsDeleteDialogOpen(true);
  };

  // Generate month options
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Color scheme
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Box>
      {/* Page header */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 0 }}
      >
        <Box>
          <Heading size="lg">Bookings</Heading>
          <Text color={textColor} mt={1}>
            Manage customer bookings
          </Text>
        </Box>

        {/* Action buttons */}
        <Flex gap={4} flexWrap="wrap">
          {/* Month filter */}
          <Select
            placeholder="Filter by month"
            value={selectedMonth}
            onChange={handleMonthChange}
            maxW="200px"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </Select>

          {/* Search input */}
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search by member name..."
              value={searchTerm}
              onChange={handleSearchChange}
              borderRadius="md"
            />
          </InputGroup>

          {/* Create button */}
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => create("bookings")}
          >
            Add Booking
          </Button>
        </Flex>
      </Flex>

      {/* Bookings table */}
      <Box bg={cardBg} borderRadius="lg" boxShadow="sm" overflow="hidden">
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Member</Th>
                <Th>Date</Th>
                <Th isNumeric>Total Amount</Th>
                <Th>Items</Th>
                <Th width="100px">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                // Loading skeleton
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <Tr key={index}>
                      <Td>
                        <Skeleton height="20px" width="30px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="120px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="100px" />
                      </Td>
                      <Td isNumeric>
                        <Skeleton height="20px" width="80px" ml="auto" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="40px" />
                      </Td>
                      <Td>
                        <Skeleton height="30px" width="90px" />
                      </Td>
                    </Tr>
                  ))
              ) : isError ? (
                // Error state
                <Tr>
                  <Td colSpan={6} textAlign="center" py={4}>
                    <Text color="red.500">
                      Error loading bookings. Please try again.
                    </Text>
                  </Td>
                </Tr>
              ) : data?.data.length === 0 ? (
                // Empty state
                <Tr>
                  <Td colSpan={6} textAlign="center" py={8}>
                    <Text color={textColor}>
                      No bookings found. Add a new booking to get started.
                    </Text>
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="blue"
                      size="sm"
                      mt={4}
                      onClick={() => create("bookings")}
                    >
                      Add Booking
                    </Button>
                  </Td>
                </Tr>
              ) : (
                // Data rows
                data?.data.map((booking: BookingData) => (
                  <Tr key={booking.id}>
                    <Td>{booking.id}</Td>
                    <Td>{booking.memberName}</Td>
                    <Td>{dayjs(booking.date).format("YYYY-MM-DD")}</Td>
                    <Td isNumeric>${booking.totalAmount}</Td>
                    <Td>
                      <Badge colorScheme="blue">
                        {booking.details?.length || 0} items
                      </Badge>
                    </Td>
                    <Td>
                      <Flex gap={2}>
                        {/* View button */}
                        <Tooltip label="View details">
                          <IconButton
                            aria-label="View booking"
                            icon={<ViewIcon />}
                            size="sm"
                            variant="ghost"
                            onClick={() => show("bookings", booking.id)}
                          />
                        </Tooltip>

                        {/* Edit button */}
                        <Tooltip label="Edit booking">
                          <IconButton
                            aria-label="Edit booking"
                            icon={<EditIcon />}
                            size="sm"
                            variant="ghost"
                            onClick={() => edit("bookings", booking.id)}
                          />
                        </Tooltip>

                        {/* Delete button */}
                        <Tooltip label="Delete booking">
                          <IconButton
                            aria-label="Delete booking"
                            icon={<DeleteIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => openDeleteDialog(booking.id)}
                          />
                        </Tooltip>
                      </Flex>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {!isLoading && data && data.data.length > 0 && (
          <Flex justify="space-between" align="center" p={4}>
            <Text fontSize="sm" color={textColor}>
              Showing page {current} of {pageCount}
            </Text>
            <Flex gap={2}>
              <Button
                size="sm"
                onClick={() => setCurrent(current - 1)}
                isDisabled={current === 1}
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={() => setCurrent(current + 1)}
                isDisabled={current === pageCount}
              >
                Next
              </Button>
            </Flex>
          </Flex>
        )}
      </Box>

      {/* Delete confirmation dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Booking
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this booking? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
