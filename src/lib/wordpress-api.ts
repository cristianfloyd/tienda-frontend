/**
 * WordPress REST API client
 * Handles communication with WordPress backend
 */

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

if (!WORDPRESS_URL) {
  throw new Error("NEXT_PUBLIC_WORDPRESS_URL environment variable is required");
}

export class WordPressAPI {
  private baseUrl: string;

  constructor(baseUrl: string = WORDPRESS_URL!) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}/wp-json/wp/v2${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Posts endpoints
  async getPosts(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/posts?${searchParams}`);
  }

  async getPost(id: number) {
    return this.request(`/posts/${id}`);
  }

  // Categories endpoints
  async getCategories(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/categories?${searchParams}`);
  }

  // Users endpoints
  async getUsers(params?: Record<string, string>) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/users?${searchParams}`);
  }
}

export const wpAPI = new WordPressAPI();