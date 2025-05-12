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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Switch,
  Stack,
} from "@chakra-ui/react";
import { 
  SearchIcon, 
  AddIcon, 
  EditIcon, 
  DeleteIcon 
} from "@chakra-ui/icons";
import {
  useDelete,
  useCreate,
  useNavigation,
  useTable,
  useGetIdentity,
  useUpdate,
} from "@refinedev/core";
import { useForm } from "react-hook-form";
import { ProductClass, User } from "../../interfaces";

/**
 * Interface for product class create/edit form
 */
interface IProductClassForm {
  name: string;
  alive: boolean;
}

/**
 * Product class list page component
 */
export const ProductClassList: React.FC = () => {
  const toast = useToast();
  const { data: user } = useGetIdentity<User>();
  const { show } = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editItemData, setEditItemData] = useState<ProductClass | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // Table hook for product classes
  const {
    tableQueryResult: { data, isLoading, isError },
    current,
    setCurrent,
    pageCount,
    filters,
    setFilters,
    setSorters,
  } = useTable<ProductClass>({
    resource: "/product-classes",
    pagination: {
      pageSize: 10,
    },
    sorters: {
      initial: [{ field: "id", order: "desc" }],
    },
  });

  // Create and update hooks
  const { mutate: createProductClass, isLoading: isCreating } = useCreate();
  const { mutate: updateProductClass, isLoading: isUpdating } = useUpdate();
  
  // Delete hook
  const { mutate: deleteProductClass, isLoading: isDeleting } = useDelete();

  // Form for create and edit modals
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    formState: { errors: errorsCreate },
    reset: resetCreate,
  } = useForm<IProductClassForm>({
    defaultValues: {
      name: "",
      alive: true,
    },
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setValueEdit,
  } = useForm<IProductClassForm>();

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

  // Open create modal
  const openCreateModal = () => {
    resetCreate();
    setIsCreateModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (item: ProductClass) => {
    setEditItemId(item.id);
    setEditItemData(item);
    setValueEdit("name", item.name);
    setValueEdit("alive", item.alive);
    setIsEditModalOpen(true);
  };

  // Handle create form submission
  const onCreateSubmit = (data: IProductClassForm) => {
    createProductClass(
      {
        resource: "/product-classes",
        values: data,
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          toast({
            title: "Category created",
            description: "The category has been created successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          resetCreate();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "There was an error creating the category",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        },
      }
    );
  };

  // Handle edit form submission
  const onEditSubmit = (data: IProductClassForm) => {
    if (editItemId) {
      updateProductClass(
        {
          resource: "/product-classes",
          id: editItemId,
          values: data,
        },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            toast({
              title: "Category updated",
              description: "The category has been updated successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          },
          onError: (error) => {
            toast({
              title: "Error",
              description: "There was an error updating the category",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          },
        }
      );
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteItemId) {
      deleteProductClass(
        {
          resource: "/product-classes",
          id: deleteItemId,
        },
        {
          onSuccess: () => {
            setIsDeleteDialogOpen(false);
            toast({
              title: "Category deleted",
              description: "The category has been deleted successfully",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          },
          onError: (error) => {
            setIsDeleteDialogOpen(false);
            toast({
              title: "Error",
              description: "There was an error deleting the category",
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
          <Heading size="lg">Product Categories</Heading>
          <Text color={textColor} mt={1}>
            Manage product categories
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
              placeholder="Search categories..."
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
              onClick={openCreateModal}
            >
              Add Category
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Categories table */}
      <Box bg={cardBg} borderRadius="lg" boxShadow="sm" overflow="hidden">
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th>Created At</Th>
                <Th>Updated At</Th>
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
                        <Skeleton height="20px" width="80px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="100px" />
                      </Td>
                      <Td>
                        <Skeleton height="20px" width="100px" />
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
                      Error loading categories. Please try again.
                    </Text>
                  </Td>
                </Tr>
              ) : data?.data.length === 0 ? (
                // Empty state
                <Tr>
                  <Td colSpan={6} textAlign="center" py={8}>
                    <Text color={textColor}>
                      No categories found. {canEdit && "Add a new category to get started."}
                    </Text>
                    {canEdit && (
                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        size="sm"
                        mt={4}
                        onClick={openCreateModal}
                      >
                        Add Category
                      </Button>
                    )}
                  </Td>
                </Tr>
              ) : (
                // Data rows
                data?.data.map((productClass: ProductClass) => (
                  <Tr key={productClass.id}>
                    <Td>{productClass.id}</Td>
                    <Td>{productClass.name}</Td>
                    <Td>
                      <Badge
                        colorScheme={productClass.alive ? "green" : "red"}
                        variant="subtle"
                      >
                        {productClass.alive ? "Active" : "Inactive"}
                      </Badge>
                    </Td>
                    <Td>
                      {productClass.createdAt
                        ? new Date(productClass.createdAt).toLocaleDateString()
                        : "N/A"}
                    </Td>
                    <Td>
                      {productClass.updatedAt
                        ? new Date(productClass.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </Td>
                    <Td>
                      <Flex gap={2}>
                        {/* Edit button (visible only for admin/manager) */}
                        {canEdit && (
                          <Tooltip label="Edit category">
                            <IconButton
                              aria-label="Edit category"
                              icon={<EditIcon />}
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditModal(productClass)}
                            />
                          </Tooltip>
                        )}

                        {/* Delete button (visible only for admin) */}
                        {canDelete && (
                          <Tooltip label="Delete category">
                            <IconButton
                              aria-label="Delete category"
                              icon={<DeleteIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => openDeleteDialog(productClass.id)}
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

      {/* Create modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmitCreate(onCreateSubmit)}>
            <ModalHeader>Create New Category</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                {/* Category name */}
                <FormControl isInvalid={!!errorsCreate.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...registerCreate("name", {
                      required: "Name is required",
                    })}
                  />
                  <FormErrorMessage>{errorsCreate.name?.message}</FormErrorMessage>
                </FormControl>

                {/* Category status */}
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="create-status" mb="0">
                    Active
                  </FormLabel>
                  <Switch
                    id="create-status"
                    {...registerCreate("alive")}
                    defaultChecked
                  />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isCreating}
              >
                Create
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Edit modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmitEdit(onEditSubmit)}>
            <ModalHeader>Edit Category</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                {/* Category name */}
                <FormControl isInvalid={!!errorsEdit.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...registerEdit("name", {
                      required: "Name is required",
                    })}
                  />
                  <FormErrorMessage>{errorsEdit.name?.message}</FormErrorMessage>
                </FormControl>

                {/* Category status */}
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="edit-status" mb="0">
                    Active
                  </FormLabel>
                  <Switch
                    id="edit-status"
                    {...registerEdit("alive")}
                  />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isUpdating}
              >
                Update
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete confirmation dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Category
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this category? This action cannot be undone and may affect products that use this category.
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
