import React, { useEffect } from "react";
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Stack,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  useToast,
  Switch,
  Flex,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
  useGetIdentity,
  useNavigation,
  useSelect,
  useUpdate,
  useOne,
} from "@refinedev/core";
import { useParams } from "react-router-dom";
import { ProductUpdateRequest, ProductResponse, User } from "../../interfaces";

/**
 * Product edit page component
 */
export const ProductEdit: React.FC = () => {
  const { id } = useParams();
  const toast = useToast();
  const { data: user } = useGetIdentity<User>();
  const { goBack, list } = useNavigation();
  
  // Fetch product data
  const { data: productData, isLoading: isProductLoading } = useOne<ProductResponse>({
    resource: "/products",
    id: id || "",
  });

  // Fetch product classes for dropdown
  const { options: productClassOptions, isLoading: isProductClassesLoading } = useSelect({
    resource: "/product-classes",
    optionLabel: "name",
    optionValue: "id",
  });

  // Update mutation
  const { mutate: updateProduct, isLoading: isUpdating } = useUpdate();

  // Form validation and handling
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductUpdateRequest>();

  // Initialize form with product data
  useEffect(() => {
    if (productData?.data) {
      setValue("name", productData.data.name);
      setValue("price", productData.data.price);
      setValue("picture", productData.data.picture);
      setValue("productClassId", productData.data.productClass.id);
    }
  }, [productData, setValue]);

  // Watch picture field for preview
  const pictureUrl = watch("picture");

  // Handle form submission
  const onSubmit = (data: ProductUpdateRequest) => {
    updateProduct(
      {
        resource: "/products",
        id: id || "",
        values: data,
      },
      {
        onSuccess: () => {
          toast({
            title: "Product updated",
            description: "The product has been updated successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          list("products");
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: "There was an error updating the product",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        },
      }
    );
  };

  // Check if user has admin or manager role
  const canEdit = user?.role === "ROLE_ADMIN" || user?.role === "ROLE_MANAGER";
  
  // Color scheme
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");

  if (!canEdit) {
    return (
      <Box textAlign="center" py={10}>
        <Heading size="lg" mb={4}>
          Access Denied
        </Heading>
        <Text mb={6}>
          You don't have permission to edit products.
        </Text>
        <Button onClick={() => list("products")}>Back to Products</Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Page header */}
      <Heading size="lg" mb={6}>
        Edit Product
      </Heading>

      {/* Edit form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={6}>
          <Card bg={cardBg} boxShadow="sm">
            <CardHeader>
              <Heading size="md">Product Information</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={5}>
                {/* Product name */}
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...register("name", {
                      required: "Name is required",
                    })}
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                {/* Product class */}
                <FormControl isInvalid={!!errors.productClassId}>
                  <FormLabel>Category</FormLabel>
                  <Select
                    placeholder="Select category"
                    {...register("productClassId", {
                      required: "Category is required",
                    })}
                    isDisabled={isProductClassesLoading}
                  >
                    {productClassOptions?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.productClassId?.message}</FormErrorMessage>
                </FormControl>

                {/* Product price */}
                <FormControl isInvalid={!!errors.price}>
                  <FormLabel>Price</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register("price", {
                        required: "Price is required",
                        min: {
                          value: 0,
                          message: "Price must be greater than or equal to 0",
                        },
                      })}
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                </FormControl>

                {/* Product image URL */}
                <FormControl isInvalid={!!errors.picture}>
                  <FormLabel>Image URL</FormLabel>
                  <Input
                    {...register("picture", {
                      required: "Image URL is required",
                    })}
                  />
                  <FormErrorMessage>{errors.picture?.message}</FormErrorMessage>
                </FormControl>

                {/* Image preview */}
                {pictureUrl && (
                  <Box mt={2}>
                    <Text fontSize="sm" mb={2}>
                      Image Preview:
                    </Text>
                    <Image
                      src={pictureUrl}
                      alt="Product preview"
                      maxH="200px"
                      borderRadius="md"
                      fallbackSrc="https://via.placeholder.com/200"
                    />
                  </Box>
                )}
              </Stack>
            </CardBody>
            <CardFooter>
              <Flex w="100%" justify="flex-end" gap={4}>
                <Button onClick={() => goBack()}>Cancel</Button>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={isUpdating}
                >
                  Save Changes
                </Button>
              </Flex>
            </CardFooter>
          </Card>
        </Stack>
      </form>
    </Box>
  );
};
