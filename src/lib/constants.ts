/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL || "",
  WC_CONSUMER_KEY: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || "",
  WC_CONSUMER_SECRET: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "",
} as const;

// Service Categories
export const SERVICE_CATEGORIES = {
  CUTTING: "cutting",
  COLORING: "coloring", 
  TREATMENTS: "treatments",
  STYLING: "styling",
} as const;

// Professional User Roles
export const USER_ROLES = {
  PROFESSIONAL: "professional",
  GUEST: "guest",
  ADMIN: "admin",
} as const;

// Cart Configuration
export const CART_CONFIG = {
  MAX_ITEMS: 100,
  LOCAL_STORAGE_KEY: "pagina-ale-cart",
} as const;

// UI Configuration
export const UI_CONFIG = {
  PRODUCTS_PER_PAGE: 12,
  MOBILE_BREAKPOINT: 768,
  DEBOUNCE_DELAY: 300,
} as const;