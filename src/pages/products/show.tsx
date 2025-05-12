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
  Image,
  Badge,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  HStack,
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
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  useOne,
  useNavigation,
  useDelete,
  useGetIdentity,
} from "@refinedev/core";
import { useParams } from "react-router-dom";
import { ProductResponse, User } from "../../interfaces";

/**
 * Product detail page component
 */
export const ProductShow: React.FC = () => {
  const { id } = useParams();
  const toast = useToast();
  const { data: user } = useGetIdentity<User>();
  const { goBack, list, edit } = useNavigation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  // Fetch product data
  const { data, isLoading, isError } = useOne<ProductResponse>({
    resource: "/products",
    id: id || "",
  });

  // Delete mutation
  const { mutate: deleteProduct, isLoading: isDeleting } = useDelete();

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    deleteProduct(
      {
        resource: "/products",
        id: id || "",
      },
      {
        onSuccess: () => {
          toast({
            title: "Product deleted",
            description: "The product has been deleted successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          list("products");
        },
        onError: (error) => {
          setIsDeleteDialogOpen(false);
          toast({
            title: "Error",
            description: "There was an error deleting the product",
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
  const borderColor = useColorModeValue("gray.200", "gray.700");
  
  // Check if user has admin or manager role
  const canEdit = user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER";
  const canDelete = user?.role === "ROLE_ADMIN";

  // Loading state
  if (isLoading) {
    return (
      <Box>
        <Heading size="lg" mb={6}>
          <Skeleton height="36px" width="200px" />
        </Heading>
        <Card bg={cardBg} boxShadow="sm">
          <CardBody>
            <Flex direction={{ base: "column", md: "row" }} gap={6}>
              <Skeleton height="300px" width="300px" borderRadius="md" />
              <Stack flex={1} spacing={4}>
                <Skeleton height="36px" width="70%" />
                <Skeleton height="24px" width="40%" />
                <Skeleton height="24px" width="30%" />
                <Skeleton height="24px" width="50%" />
              </Stack>
            </Flex>
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
          There was an error loading the product. Please try again.
        </Text>
        <Button onClick={() => list("products")}>Back to Products</Button>
      </Box>
    );
  }

  const product = data?.data;

  return (
    <Box>
      {/* Page header with actions */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Product Details</Heading>
        <HStack spacing={4}>
          <Button onClick={() => goBack()}>Back</Button>
          
          {/* Edit button (visible only for admin/manager) */}
          {canEdit && (
            <Button
              leftIcon={<EditIcon />}
              colorScheme="blue"
              variant="outline"
              onClick={() => edit("products", id || "")}
            >
              Edit
            </Button>
          )}
          
          {/* Delete button (visible only for admin) */}
          {canDelete && (
            <Button
              leftIcon={<DeleteIcon />}
              colorScheme="red"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Product detail card */}
      <Card bg={cardBg} boxShadow="md" borderRadius="lg" overflow="hidden">
        <CardBody>
          <Flex 
            direction={{ base: "column", md: "row" }} 
            gap={8}
            align={{ base: "center", md: "start" }}
          >
            {/* Product image */}
            <Box 
              maxW={{ base: "100%", md: "300px" }}
              minW={{ base: "auto", md: "300px" }}
            >
              <Image
                src={product?.picture || ""}
                alt={product?.name || ""}
                borderRadius="lg"
                objectFit="cover"
                maxH="300px"
                w="100%"
                fallbackSrc="https://via.placeholder.com/300"
              />
            </Box>

            {/* Product details */}
            <Stack flex={1} spacing={4}>
              <Box>
                <HStack mb={2}>
                  <Heading size="lg">{product?.name}</Heading>
                  <Badge
                    colorScheme={product?.alive ? "green" : "red"}
                    fontSize="0.8em"
                    p={1}
                  >
                    {product?.alive ? "Active" : "Inactive"}
                  </Badge>
                </HStack>
                <Badge colorScheme="blue" fontSize="0.9em">
                  {product?.productClass?.name || "No Category"}
                </Badge>
              </Box>

              <Divider />

              <Stat>
                <StatLabel>Price</StatLabel>
                <StatNumber>${product?.price}</StatNumber>
              </Stat>

              <Divider />

              <Box>
                <Text fontWeight="bold" mb={1}>
                  Product ID
                </Text>
                <Text>{product?.id}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={1}>
                  Created At
                </Text>
                <Text>
                  {product?.createdAt ? new Date(product.createdAt).toLocaleString() : "N/A"}
                </Text>
              </Box>

              <Box>
                <Text fontWeight="bold" mb={1}>
                  Last Updated
                </Text>
                <Text>
                  {product?.updatedAt ? new Date(product.updatedAt).toLocaleString() : "N/A"}
                </Text>
              </Box>
            </Stack>
          </Flex>
        </CardBody>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this product? This action cannot be undone.
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
