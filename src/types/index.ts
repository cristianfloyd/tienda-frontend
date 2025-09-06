/**
 * Main application types
 */

export * from "./wordpress";
export * from "./woocommerce";

import { WCOrderAddress } from "./woocommerce";

// Application-specific types
export interface ProfessionalUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  businessName: string;
  taxId?: string;
  professionalLicense?: string;
  role: "professional" | "admin";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: number;
  variationId?: number;
  quantity: number;
  name: string;
  price: string;
  image?: string;
  sku?: string;
}

export interface Cart {
  items: CartItem[];
  total: string;
  itemCount: number;
  updatedAt: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  productCount: number;
}

// API Response types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  businessName: string;
  message: string;
}

export interface CheckoutForm extends WCOrderAddress {
  paymentMethod: string;
  createAccount?: boolean;
  orderNotes?: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  sortBy?: "name" | "price" | "date" | "popularity";
  sortOrder?: "asc" | "desc";
}