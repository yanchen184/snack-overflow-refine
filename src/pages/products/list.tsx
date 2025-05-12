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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
  Image,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import { 
  SearchIcon, 
  AddIcon, 
  ChevronDownIcon, 
  EditIcon, 
  DeleteIcon, 
  ViewIcon 
} from "@chakra-ui/icons";
import {
  useDelete,
  useNavigation,
  useTable,
  useGetIdentity,
} from "@refinedev/core";
import { Product, User } from "../../interfaces";

/**
 * Product list page component
 */
export const ProductList: React.FC = () => {
  const toast = useToast();
  const { data: user } = useGetIdentity<User>();
  const { show, create, edit } = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // Table hook for products
  const {
    tableQueryResult: { data, isLoading, isError },
    current,
    setCurrent,
    pageCount,
    filters,
    setFilters,
    setSorters,
  } = useTable<Product>({
    resource: "/products",
    pagination: {
      pageSize: 10,
    },
    sorters: {
      initial: [{ field: "id", order: "desc" }],
    },
  });

  // Delete hook
  const { mutate: deleteProduct, isLoading: isDeleting } = useDelete();

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    
    // Set filter when search term changes
    setFilters([
      {
        field: "name",
        operator: "contains",
        value: e.target.value,
      },
    ]);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteItemId) {
      deleteProduct(
        {
          resource: "/products",
          id: deleteItemId,
        },
        {
          onSuccess: () => {
            setIsDeleteDialogOpen(false);
            toast({
              title: "Product deleted",
              description: "The product has been deleted successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
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
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id: number) => {
    setDeleteItemId(id);
    setIsDeleteDialogOpen(true);
  };

  // Color scheme
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");

  // Check if user has admin or manager role
  const canEdit = user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER";
  const canDelete = user?.role === "ROLE_ADMIN";

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
          <Heading size="lg">Products</Heading>
          <Text color={textColor} mt={1}>
            Manage your products catalog
          </Text>
        </Box>

        {/* Action buttons */}
        <Flex gap={4}>
          {/* Search input */}
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              borderRadius="md"
            />
          </InputGroup>

          {/* Create button (visible only for admin/manager) */}
          {canEdit && (
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={() => create("products")}
            >
              Add Product
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Products table */}
      <Box bg={cardBg} borderRadius="lg" boxShadow="sm" overflow="hidden">
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Image</Th>
                <Th>Name</Th>
                <Th>Category</Th>
                <Th isNumeric>Price</Th>
                <Th>Status</Th>
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
                        <Skeleton height="40px" width="40px" borderRadius="md" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="120px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="100px" />
                      </Td>
                      <Td isNumeric>
                        <Skeleton height="20px" width="60px" ml="auto" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="80px" />
                      </Td>
                      <Td>
                        <Skeleton height="30px" width="90px" />
                      </Td>
                    </Tr>
                  ))
              ) : isError ? (
                // Error state
                <Tr>
                  <Td colSpan={7} textAlign="center" py={4}>
                    <Text color="red.500">
                      Error loading products. Please try again.
                    </Text>
                  </Td>
                </Tr>
              ) : data?.data.length === 0 ? (
                // Empty state
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8}>
                    <Text color={textColor}>
                      No products found. {canEdit && "Add a new product to get started."}
                    </Text>
                    {canEdit && (
                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        size="sm"
                        mt={4}
                        onClick={() => create("products")}
                      >
                        Add Product
                      </Button>
                    )}
                  </Td>
                </Tr>
              ) : (
                // Data rows
                data?.data.map((product: Product) => (
                  <Tr key={product.id}>
                    <Td>{product.id}</Td>
                    <Td>
                      <Image
                        src={product.picture}
                        alt={product.name}
                        boxSize="40px"
                        objectFit="cover"
                        borderRadius="md"
                        fallbackSrc="https://via.placeholder.com/40"
                      />
                    </Td>
                    <Td>{product.name}</Td>
                    <Td>
                      <Badge colorScheme="blue">
                        {product.productClass?.name || "Unknown"}
                      </Badge>
                    </Td>
                    <Td isNumeric>{product.price}</Td>
                    <Td>
                      <Badge
                        colorScheme={product.alive ? "green" : "red"}
                        variant="subtle"
                      >
                        {product.alive ? "Active" : "Inactive"}
                      </Badge>
                    </Td>
                    <Td>
                      <Flex gap={2}>
                        {/* View button */}
                        <Tooltip label="View details">
                          <IconButton
                            aria-label="View product"
                            icon={<ViewIcon />}
                            size="sm"
                            variant="ghost"
                            onClick={() => show("products", product.id)}
                          />
                        </Tooltip>

                        {/* Edit button (visible only for admin/manager) */}
                        {canEdit && (
                          <Tooltip label="Edit product">
                            <IconButton
                              aria-label="Edit product"
                              icon={<EditIcon />}
                              size="sm"
                              variant="ghost"
                              onClick={() => edit("products", product.id)}
                            />
                          </Tooltip>
                        )}

                        {/* Delete button (visible only for admin) */}
                        {canDelete && (
                          <Tooltip label="Delete product">
                            <IconButton
                              aria-label="Delete product"
                              icon={<DeleteIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => openDeleteDialog(product.id)}
                            />
                          </Tooltip>
                        )}
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
