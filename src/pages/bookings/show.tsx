import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Stack,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Skeleton,
  useColorModeValue,
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  HStack,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  useOne,
  useNavigation,
  useDelete,
  useGetIdentity,
} from "@refinedev/core";
import { useParams } from "react-router-dom";
import { BookingData, User } from "../../interfaces";
import dayjs from "dayjs";

/**
 * Booking detail page component
 */
export const BookingShow: React.FC = () => {
  const { id } = useParams();
  const toast = useToast();
  const { data: user } = useGetIdentity<User>();
  const { goBack, list, edit } = useNavigation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  // Fetch booking data
  const { data, isLoading, isError } = useOne<BookingData>({
    resource: "/bookings",
    id: id || "",
  });

  // Delete mutation
  const { mutate: deleteBooking, isLoading: isDeleting } = useDelete();

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    deleteBooking(
      {
        resource: "/bookings",
        id: id || "",
      },
      {
        onSuccess: () => {
          toast({
            title: "Booking deleted",
            description: "The booking has been deleted successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          list("bookings");
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
  };

  // Color scheme
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  
  // Calculate booking summary data
  const booking = data?.data;
  const totalItems = booking?.details?.length || 0;
  const totalAmount = booking?.totalAmount || 0;

  // Loading state
  if (isLoading) {
    return (
      <Box>
        <Heading size="lg" mb={6}>
          <Skeleton height="36px" width="200px" />
        </Heading>
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Stack spacing={4}>
              <Skeleton height="24px" width="70%" />
              <Skeleton height="20px" width="40%" />
              <Skeleton height="20px" width="30%" />
              <Divider />
              <Skeleton height="200px" width="100%" />
            </Stack>
          </CardBody>
        </Card>
      </Box>
    );
  }

  // Error state
  if (isError) {
    return (
      <Box textAlign="center" py={10}>
        <Heading size="lg" mb={4}>
          Error
        </Heading>
        <Text mb={6}>
          There was an error loading the booking. Please try again.
        </Text>
        <Button onClick={() => list("bookings")}>Back to Bookings</Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Page header with actions */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Booking Details</Heading>
        <HStack spacing={4}>
          <Button onClick={() => goBack()}>Back</Button>
          <Button
            leftIcon={<EditIcon />}
            colorScheme="blue"
            variant="outline"
            onClick={() => edit("bookings", id || "")}
          >
            Edit
          </Button>
          <Button
            leftIcon={<DeleteIcon />}
            colorScheme="red"
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </HStack>
      </Flex>

      {/* Booking details card */}
      <Stack spacing={6}>
        {/* Booking info */}
        <Card bg={cardBg} boxShadow="md">
          <CardHeader pb={0}>
            <Heading size="md">Booking Information</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              <Flex 
                justify="space-between" 
                align="flex-start"
                direction={{ base: "column", md: "row" }}
                gap={{ base: 2, md: 0 }}
              >
                <Box mb={{ base: 4, md: 0 }}>
                  <Text color={textColor} fontWeight="bold">Booking ID</Text>
                  <Text>{booking?.id}</Text>
                </Box>

                <Box mb={{ base: 4, md: 0 }}>
                  <Text color={textColor} fontWeight="bold">Member</Text>
                  <Text>{booking?.memberName}</Text>
                </Box>

                <Box mb={{ base: 4, md: 0 }}>
                  <Text color={textColor} fontWeight="bold">Date</Text>
                  <Text>{dayjs(booking?.date).format("YYYY-MM-DD")}</Text>
                </Box>

                <Box mb={{ base: 4, md: 0 }}>
                  <Text color={textColor} fontWeight="bold">Created At</Text>
                  <Text>{dayjs(booking?.createdAt).format("YYYY-MM-DD HH:mm")}</Text>
                </Box>
              </Flex>

              <Divider />

              <Flex 
                justify="space-between" 
                align="center"
                direction={{ base: "column", sm: "row" }}
                gap={{ base: 2, sm: 0 }}
              >
                <HStack spacing={8}>
                  <Box textAlign="center">
                    <Text color={textColor} fontWeight="bold">Items</Text>
                    <Text fontSize="xl">{totalItems}</Text>
                  </Box>
                  
                  <Box textAlign="center">
                    <Text color={textColor} fontWeight="bold">Total Amount</Text>
                    <Text fontSize="xl" fontWeight="bold">${totalAmount}</Text>
                  </Box>
                </HStack>

                <Badge 
                  colorScheme="green" 
                  fontSize="md" 
                  py={1} 
                  px={3} 
                  borderRadius="md"
                >
                  Completed
                </Badge>
              </Flex>
            </Stack>
          </CardBody>
        </Card>

        {/* Booking items */}
        <Card bg={cardBg} boxShadow="md">
          <CardHeader pb={0}>
            <Heading size="md">Booking Items</Heading>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Product</Th>
                    <Th isNumeric>Price</Th>
                    <Th isNumeric>Quantity</Th>
                    <Th isNumeric>Subtotal</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {booking?.details?.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.productName}</Td>
                      <Td isNumeric>${item.price}</Td>
                      <Td isNumeric>{item.quantity}</Td>
                      <Td isNumeric>${item.price * item.quantity}</Td>
                    </Tr>
                  ))}
                  <Tr>
                    <Td colSpan={3} textAlign="right" fontWeight="bold">
                      Total:
                    </Td>
                    <Td isNumeric fontWeight="bold">
                      ${totalAmount}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </Stack>

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
