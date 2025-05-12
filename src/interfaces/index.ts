// Common interfaces
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// Auth related interfaces
export interface AuthenticationRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// Product related interfaces
export interface Product extends BaseEntity {
  name: string;
  picture: string;
  price: number;
  alive: boolean;
  productClass: ProductClass;
}

export interface ProductClass extends BaseEntity {
  name: string;
  alive: boolean;
}

export interface ProductCreateRequest {
  name: string;
  price: number;
  picture: string;
  productClassId: number;
}

export interface ProductUpdateRequest {
  name: string;
  price: number;
  picture: string;
  productClassId: number;
}

export interface ProductResponse extends BaseEntity {
  name: string;
  price: number;
  picture: string;
  alive: boolean;
  productClass: {
    id: number;
    name: string;
  };
}

// Booking related interfaces
export interface BookingDetail {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface BookingDto {
  id?: number;
  memberId?: number;
  memberName: string;
  date: string;
  bookingDetailDtoList: BookingDetailDto[];
}

export interface BookingDetailDto {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface BookingData extends BaseEntity {
  memberName: string;
  date: string;
  details: BookingDetail[];
  totalAmount: number;
}

export interface CountBookingReturnData {
  memberName: string;
  count: number;
}

// Member related interfaces
export interface Member extends BaseEntity {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  vip: string;
}

// API Response interfaces
export interface ResultData<T> {
  code: number;
  data: T;
  message: string;
  timestamp: string;
  success: boolean;
}

export interface PaginationData {
  pageSize: number;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface PageResult<T> {
  items: T[];
  pagination: PaginationData;
}

export interface PaginationResultData<T> {
  code: number;
  message: string;
  data: {
    items: T[];
    pagination: PaginationData;
  };
  timestamp: string;
  success: boolean;
}

// User interface for auth context
export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}
