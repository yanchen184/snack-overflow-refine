import { DataProvider } from "@refinedev/core";
import axios, { AxiosInstance } from "axios";
import { PageResult, PaginationResultData, ResultData } from "../interfaces";

/**
 * Custom data provider for the API
 * Handles custom pagination, sorting, filtering and CRUD operations
 */
export const dataProvider = (apiUrl: string): DataProvider => {
  // Create Axios instance with default configuration
  const axiosInstance: AxiosInstance = axios.create({
    baseURL: apiUrl,
  });

  // Set up request interceptor to add auth token
  axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    // Get a list of resources with pagination, sorting and filtering
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
      const url = `${resource}`;

      // Default values
      const { current = 1, pageSize = 10 } = pagination ?? {};

      // Parse query parameters for pagination, sorting and filtering
      const queryParams: Record<string, any> = {
        page: current - 1, // API uses 0-based pagination
        size: pageSize,
      };

      // Apply filters if defined
      if (filters) {
        filters.forEach((filter) => {
          if (filter.operator === "eq") {
            queryParams[filter.field] = filter.value;
          }
        });
      }

      // Apply sorting if defined
      if (sorters && sorters.length > 0) {
        const sorter = sorters[0];
        queryParams.sort = `${sorter.field},${sorter.order === "asc" ? "asc" : "desc"}`;
      }

      try {
        // Make API request
        const response = await axiosInstance.get(url, {
          params: queryParams,
        });

        // Handle standard pagination response
        if (response.data && response.data.data && response.data.data.pagination) {
          const result = response.data as PaginationResultData<any>;
          const pageResult = result.data as PageResult<any>;
          
          return {
            data: pageResult.items,
            total: pageResult.pagination.totalItems,
          };
        }

        // Handle basic list response without pagination
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          const result = response.data as ResultData<any[]>;
          
          return {
            data: result.data,
            total: result.data.length,
          };
        }

        // Fallback for unexpected response format
        return {
          data: [],
          total: 0,
        };
      } catch (error) {
        console.error("[getList] Error:", error);
        throw error;
      }
    },

    // Get a single resource by ID
    getOne: async ({ resource, id, meta }) => {
      const url = `${resource}/${id}`;

      try {
        // Make API request
        const response = await axiosInstance.get(url);

        // Handle standard response
        if (response.data && response.data.data) {
          const result = response.data as ResultData<any>;
          
          return {
            data: result.data,
          };
        }

        // Fallback for unexpected response format
        return {
          data: {},
        };
      } catch (error) {
        console.error("[getOne] Error:", error);
        throw error;
      }
    },

    // Create a new resource
    create: async ({ resource, variables, meta }) => {
      const url = `${resource}`;

      try {
        // Make API request
        const response = await axiosInstance.post(url, variables);

        // Handle standard response
        if (response.data && response.data.data) {
          const result = response.data as ResultData<any>;
          
          return {
            data: result.data,
          };
        }

        // Fallback for unexpected response format
        return {
          data: {},
        };
      } catch (error) {
        console.error("[create] Error:", error);
        throw error;
      }
    },

    // Update an existing resource
    update: async ({ resource, id, variables, meta }) => {
      const url = `${resource}/${id}`;

      try {
        // Make API request
        const response = await axiosInstance.put(url, variables);

        // Handle standard response
        if (response.data && response.data.data) {
          const result = response.data as ResultData<any>;
          
          return {
            data: result.data,
          };
        }

        // Fallback for unexpected response format
        return {
          data: {},
        };
      } catch (error) {
        console.error("[update] Error:", error);
        throw error;
      }
    },

    // Delete a resource
    deleteOne: async ({ resource, id, meta }) => {
      const url = `${resource}/${id}`;

      try {
        // Make API request
        const response = await axiosInstance.delete(url);

        // Handle standard response
        return {
          data: response.data?.data || {},
        };
      } catch (error) {
        console.error("[deleteOne] Error:", error);
        throw error;
      }
    },

    // Get multiple resources by IDs
    getMany: async ({ resource, ids, meta }) => {
      // If the API doesn't support fetching multiple resources by IDs in a single request,
      // make multiple getOne requests
      try {
        const responses = await Promise.all(
          ids.map((id) => axiosInstance.get(`${resource}/${id}`))
        );

        // Extract data from all responses
        const data = responses.map((response) => {
          if (response.data && response.data.data) {
            const result = response.data as ResultData<any>;
            return result.data;
          }
          return {};
        });

        return {
          data,
        };
      } catch (error) {
        console.error("[getMany] Error:", error);
        throw error;
      }
    },

    // Create multiple resources
    createMany: async ({ resource, variables, meta }) => {
      // If the API support batch creation, use a single request
      if (meta?.batchUrl) {
        try {
          const response = await axiosInstance.post(`${resource}/${meta.batchUrl}`, variables);
          return {
            data: response.data?.data || [],
          };
        } catch (error) {
          console.error("[createMany] Error:", error);
          throw error;
        }
      }

      // Otherwise, make multiple create requests
      try {
        const responses = await Promise.all(
          variables.map((variable) => axiosInstance.post(`${resource}`, variable))
        );

        // Extract data from all responses
        const data = responses.map((response) => {
          if (response.data && response.data.data) {
            const result = response.data as ResultData<any>;
            return result.data;
          }
          return {};
        });

        return {
          data,
        };
      } catch (error) {
        console.error("[createMany] Error:", error);
        throw error;
      }
    },

    // Update multiple resources
    updateMany: async ({ resource, ids, variables, meta }) => {
      // Make multiple update requests
      try {
        const responses = await Promise.all(
          ids.map((id) => axiosInstance.put(`${resource}/${id}`, variables))
        );

        // Extract data from all responses
        const data = responses.map((response) => {
          if (response.data && response.data.data) {
            const result = response.data as ResultData<any>;
            return result.data;
          }
          return {};
        });

        return {
          data,
        };
      } catch (error) {
        console.error("[updateMany] Error:", error);
        throw error;
      }
    },

    // Delete multiple resources
    deleteMany: async ({ resource, ids, meta }) => {
      // Make multiple delete requests
      try {
        await Promise.all(
          ids.map((id) => axiosInstance.delete(`${resource}/${id}`))
        );

        return {
          data: [],
        };
      } catch (error) {
        console.error("[deleteMany] Error:", error);
        throw error;
      }
    },

    // Custom method for API operations that don't fit into CRUD
    custom: async ({ url, method, filters, sorters, payload, query, headers, meta }) => {
      let requestUrl = url;

      // Add query parameters to URL
      const queryParams: Record<string, any> = query ?? {};

      // Add filters to query parameters
      if (filters) {
        filters.forEach((filter) => {
          if (filter.operator === "eq") {
            queryParams[filter.field] = filter.value;
          }
        });
      }

      // Add sorting to query parameters
      if (sorters && sorters.length > 0) {
        const sorter = sorters[0];
        queryParams.sort = `${sorter.field},${sorter.order === "asc" ? "asc" : "desc"}`;
      }

      try {
        // Make API request based on HTTP method
        let response;

        switch (method) {
          case "get":
            response = await axiosInstance.get(requestUrl, {
              params: queryParams,
              headers,
            });
            break;
          case "post":
            response = await axiosInstance.post(requestUrl, payload, {
              params: queryParams,
              headers,
            });
            break;
          case "put":
            response = await axiosInstance.put(requestUrl, payload, {
              params: queryParams,
              headers,
            });
            break;
          case "patch":
            response = await axiosInstance.patch(requestUrl, payload, {
              params: queryParams,
              headers,
            });
            break;
          case "delete":
            response = await axiosInstance.delete(requestUrl, {
              params: queryParams,
              headers,
              data: payload,
            });
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        // Return data from response
        return {
          data: response.data?.data || {},
        };
      } catch (error) {
        console.error("[custom] Error:", error);
        throw error;
      }
    },
  };
};
