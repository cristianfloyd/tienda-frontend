/**
 * WooCommerce REST API client
 * Handles e-commerce operations with WooCommerce backend
 */

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

if (!WORDPRESS_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  throw new Error(
    "WooCommerce API credentials are required: NEXT_PUBLIC_WORDPRESS_URL, NEXT_PUBLIC_WC_CONSUMER_KEY, NEXT_PUBLIC_WC_CONSUMER_SECRET"
  );
}

export class WooCommerceAPI {
  private baseUrl: string;
  private auth: string;

  constructor(
    baseUrl: string = WORDPRESS_URL!,
    consumerKey: string = WC_CONSUMER_KEY!,
    consumerSecret: string = WC_CONSUMER_SECRET!
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.auth = btoa(`${consumerKey}:${consumerSecret}`);
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}/wp-json/wc/v3${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${this.auth}`,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Products endpoints
  async getProducts(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/products?${searchParams}`);
  }

  async getProduct(id: number) {
    return this.request(`/products/${id}`);
  }

  // Categories endpoints
  async getProductCategories(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/products/categories?${searchParams}`);
  }

  // Orders endpoints
  async getOrders(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/orders?${searchParams}`);
  }

  async createOrder(orderData: any) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  // Customers endpoints
  async getCustomers(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/customers?${searchParams}`);
  }
}

export const wcAPI = new WooCommerceAPI();