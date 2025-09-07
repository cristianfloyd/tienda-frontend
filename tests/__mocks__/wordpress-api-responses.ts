/**
 * Mock data for WordPress API responses
 * Used for consistent testing with WordPress data structures
 */

export const mockWordPressPosts = [
  {
    id: 1,
    date: "2025-01-01T12:00:00",
    date_gmt: "2025-01-01T12:00:00",
    guid: {
      rendered: "https://example.com/?p=1",
    },
    modified: "2025-01-01T12:00:00",
    modified_gmt: "2025-01-01T12:00:00",
    slug: "sample-post",
    status: "publish",
    type: "post",
    link: "https://example.com/sample-post",
    title: {
      rendered: "Sample WordPress Post",
    },
    content: {
      rendered: "<p>This is a sample WordPress post content.</p>",
      protected: false,
    },
    excerpt: {
      rendered: "<p>Sample excerpt</p>",
      protected: false,
    },
    author: 1,
    featured_media: 0,
    comment_status: "open",
    ping_status: "open",
    sticky: false,
    template: "",
    format: "standard",
    meta: [],
    categories: [1],
    tags: [],
    _links: {},
  },
];

export const mockWordPressCategories = [
  {
    id: 1,
    count: 5,
    description: "Sample category description",
    link: "https://example.com/category/sample",
    name: "Sample Category",
    slug: "sample-category",
    taxonomy: "category",
    parent: 0,
    meta: [],
    _links: {},
  },
];

export const mockWordPressUsers = [
  {
    id: 1,
    name: "Test User",
    url: "https://example.com",
    description: "Test user description",
    link: "https://example.com/author/test-user",
    slug: "test-user",
    avatar_urls: {
      24: "https://example.com/avatar24.jpg",
      48: "https://example.com/avatar48.jpg",
      96: "https://example.com/avatar96.jpg",
    },
    meta: [],
    _links: {},
  },
];
