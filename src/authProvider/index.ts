import { AuthBindings } from "@refinedev/core";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthenticationRequest, RegisterRequest, User } from "../interfaces";

const API_URL = "http://localhost:8080/api/auth";

/**
 * JWT token payload structure
 */
interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

/**
 * Authentication provider for user login, registration and token management
 */
export const authProvider: AuthBindings = {
  /**
   * User login method
   */
  login: async ({ email, password }) => {
    try {
      // Make API call to authenticate
      const response = await axios.post(`${API_URL}/authenticate`, {
        email,
        password,
      } as AuthenticationRequest);

      // Check if response is successful
      if (response.data && response.data.data && response.data.data.token) {
        // Save tokens to localStorage
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        // Decode token to get user info
        const decodedToken = jwtDecode<JwtPayload>(response.data.data.token);

        // Create user object
        const user: User = {
          id: parseInt(decodedToken.sub),
          email: decodedToken.email,
          firstname: decodedToken.firstname,
          lastname: decodedToken.lastname,
          role: decodedToken.role,
        };

        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(user));

        return {
          success: true,
          redirectTo: "/",
        };
      }

      // If response doesn't contain token, return error
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Invalid credentials",
        },
      };
    } catch (error: any) {
      // Handle API errors
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error.response?.data?.message || "Login failed",
        },
      };
    }
  },

  /**
   * User registration method
   */
  register: async ({ firstname, lastname, email, password }) => {
    try {
      // Make API call to register
      const response = await axios.post(`${API_URL}/register`, {
        firstname,
        lastname,
        email,
        password,
      } as RegisterRequest);

      // Check if response is successful
      if (response.data && response.data.data && response.data.data.token) {
        // Save tokens to localStorage
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        // Decode token to get user info
        const decodedToken = jwtDecode<JwtPayload>(response.data.data.token);

        // Create user object
        const user: User = {
          id: parseInt(decodedToken.sub),
          email: decodedToken.email,
          firstname: decodedToken.firstname,
          lastname: decodedToken.lastname,
          role: decodedToken.role,
        };

        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(user));

        return {
          success: true,
          redirectTo: "/",
        };
      }

      // If response doesn't contain token, return error
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: "Registration failed",
        },
      };
    } catch (error: any) {
      // Handle API errors
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: error.response?.data?.message || "Registration failed",
        },
      };
    }
  },

  /**
   * Check if user is logged in
   */
  check: async () => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token doesn't exist, user is not logged in
    if (!token) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }

    try {
      // Decode token to check expiration
      const decodedToken = jwtDecode<JwtPayload>(token);
      
      // Check if token is expired
      const isTokenExpired = decodedToken.exp * 1000 < Date.now();

      if (isTokenExpired) {
        // Token expired, try to renew
        try {
          const response = await axios.get(`${API_URL}/renew`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data && response.data.data && response.data.data.token) {
            // Update tokens in localStorage
            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem("refreshToken", response.data.data.refreshToken);

            // Decode new token and update user info
            const newDecodedToken = jwtDecode<JwtPayload>(response.data.data.token);
            
            const user: User = {
              id: parseInt(newDecodedToken.sub),
              email: newDecodedToken.email,
              firstname: newDecodedToken.firstname,
              lastname: newDecodedToken.lastname,
              role: newDecodedToken.role,
            };

            localStorage.setItem("user", JSON.stringify(user));

            return {
              authenticated: true,
            };
          }
        } catch (error) {
          // Renewal failed, redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          
          return {
            authenticated: false,
            redirectTo: "/login",
            logout: true,
          };
        }
      }

      // Token is valid, user is authenticated
      return {
        authenticated: true,
      };
    } catch (error) {
      // Token is invalid, redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  /**
   * User logout method
   */
  logout: async () => {
    // Remove tokens and user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  /**
   * Get user identity
   */
  getIdentity: async () => {
    // Get user info from localStorage
    const userStr = localStorage.getItem("user");
    
    if (userStr) {
      const user: User = JSON.parse(userStr);
      
      return {
        ...user,
        name: `${user.firstname} ${user.lastname}`,
      };
    }
    
    return null;
  },

  /**
   * Get permissions based on user role
   */
  getPermissions: async () => {
    // Get user info from localStorage
    const userStr = localStorage.getItem("user");
    
    if (userStr) {
      const user: User = JSON.parse(userStr);
      return user.role;
    }
    
    return null;
  },

  /**
   * Update password method (not implemented)
   */
  updatePassword: async () => {
    return {
      success: false,
      error: {
        name: "UpdatePasswordError",
        message: "Not implemented",
      },
    };
  },

  /**
   * Handle forgotten password (not implemented)
   */
  forgotPassword: async () => {
    return {
      success: false,
      error: {
        name: "ForgotPasswordError",
        message: "Not implemented",
      },
    };
  },

  /**
   * Handle OAuth login (not implemented)
   */
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
