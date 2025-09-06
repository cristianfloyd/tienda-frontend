/**
 * Mock data for WooCommerce API responses
 * Used for consistent testing with WooCommerce data structures
 */

import type { WooCommerceProduct, WooCommerceCategory, WooCommerceOrder, WooCommerceCustomer } from '../../src/types/woocommerce';

export const mockWooCommerceProducts: WooCommerceProduct[] = [
  {
    id: 1,
    name: 'Sample Product',
    slug: 'sample-product',
    permalink: 'https://example.com/product/sample-product',
    date_created: '2025-01-01T12:00:00',
    date_created_gmt: '2025-01-01T12:00:00',
    date_modified: '2025-01-01T12:00:00',
    date_modified_gmt: '2025-01-01T12:00:00',
    type: 'simple',
    status: 'publish',
    featured: false,
    catalog_visibility: 'visible',
    description: '<p>Sample product description</p>',
    short_description: '<p>Sample short description</p>',
    sku: 'SAMPLE-001',
    price: '29.99',
    regular_price: '29.99',
    sale_price: '',
    date_on_sale_from: null,
    date_on_sale_from_gmt: null,
    date_on_sale_to: null,
    date_on_sale_to_gmt: null,
    on_sale: false,
    purchasable: true,
    total_sales: 0,
    virtual: false,
    downloadable: false,
    downloads: [],
    download_limit: -1,
    download_expiry: -1,
    external_url: '',
    button_text: '',
    tax_status: 'taxable',
    tax_class: '',
    manage_stock: false,
    stock_quantity: null,
    backorders: 'no',
    backorders_allowed: false,
    backordered: false,
    low_stock_amount: null,
    sold_individually: false,
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    shipping_required: true,
    shipping_taxable: true,
    shipping_class: '',
    shipping_class_id: 0,
    reviews_allowed: true,
    average_rating: '0.00',
    rating_count: 0,
    upsell_ids: [],
    cross_sell_ids: [],
    parent_id: 0,
    purchase_note: '',
    categories: [
      {
        id: 1,
        name: 'Sample Category',
        slug: 'sample-category'
      }
    ],
    tags: [],
    images: [
      {
        id: 1,
        date_created: '2025-01-01T12:00:00',
        date_created_gmt: '2025-01-01T12:00:00',
        date_modified: '2025-01-01T12:00:00',
        date_modified_gmt: '2025-01-01T12:00:00',
        src: 'https://example.com/sample-product.jpg',
        name: 'Sample Product Image',
        alt: 'Sample Product'
      }
    ],
    attributes: [],
    default_attributes: [],
    variations: [],
    grouped_products: [],
    menu_order: 0,
    price_html: '<span class="woocommerce-Price-amount amount">$29.99</span>',
    related_ids: [],
    meta_data: [],
    stock_status: 'instock',
    has_options: false,
    _links: {}
  }
];

export const mockWooCommerceCategories: WooCommerceCategory[] = [
  {
    id: 1,
    name: 'Sample Category',
    slug: 'sample-category',
    parent: 0,
    description: 'Sample category description',
    display: 'default',
    image: {
      id: 1,
      date_created: '2025-01-01T12:00:00',
      date_created_gmt: '2025-01-01T12:00:00',
      date_modified: '2025-01-01T12:00:00',
      date_modified_gmt: '2025-01-01T12:00:00',
      src: 'https://example.com/category-image.jpg',
      name: 'Category Image',
      alt: 'Sample Category'
    },
    menu_order: 0,
    count: 5,
    _links: {}
  }
];

export const mockWooCommerceOrders: WooCommerceOrder[] = [
  {
    id: 1,
    parent_id: 0,
    status: 'processing',
    currency: 'USD',
    version: '8.0.0',
    prices_include_tax: false,
    date_created: '2025-01-01T12:00:00',
    date_modified: '2025-01-01T12:00:00',
    discount_total: '0.00',
    discount_tax: '0.00',
    shipping_total: '5.00',
    shipping_tax: '0.00',
    cart_tax: '0.00',
    total: '34.99',
    total_tax: '0.00',
    customer_id: 1,
    order_key: 'wc_order_sample123',
    billing: {
      first_name: 'John',
      last_name: 'Doe',
      company: '',
      address_1: '123 Sample St',
      address_2: '',
      city: 'Sample City',
      state: 'CA',
      postcode: '12345',
      country: 'US',
      email: 'john.doe@example.com',
      phone: '+1234567890'
    },
    shipping: {
      first_name: 'John',
      last_name: 'Doe',
      company: '',
      address_1: '123 Sample St',
      address_2: '',
      city: 'Sample City',
      state: 'CA',
      postcode: '12345',
      country: 'US'
    },
    payment_method: 'stripe',
    payment_method_title: 'Credit Card',
    transaction_id: 'txn_sample123',
    customer_ip_address: '127.0.0.1',
    customer_user_agent: 'Mozilla/5.0',
    created_via: 'checkout',
    customer_note: '',
    date_completed: null,
    date_paid: null,
    cart_hash: '',
    number: '1',
    meta_data: [],
    line_items: [
      {
        id: 1,
        name: 'Sample Product',
        product_id: 1,
        variation_id: 0,
        quantity: 1,
        tax_class: '',
        subtotal: '29.99',
        subtotal_tax: '0.00',
        total: '29.99',
        total_tax: '0.00',
        taxes: [],
        meta_data: [],
        sku: 'SAMPLE-001',
        price: 29.99,
        image: {
          id: '',
          src: ''
        },
        parent_name: null
      }
    ],
    tax_lines: [],
    shipping_lines: [],
    fee_lines: [],
    coupon_lines: [],
    refunds: [],
    payment_url: '',
    is_editable: false,
    needs_payment: true,
    needs_processing: true,
    date_created_gmt: '2025-01-01T12:00:00',
    date_modified_gmt: '2025-01-01T12:00:00',
    date_completed_gmt: null,
    date_paid_gmt: null,
    currency_symbol: '$',
    _links: {}
  }
];

export const mockWooCommerceCustomers: WooCommerceCustomer[] = [
  {
    id: 1,
    date_created: '2025-01-01T12:00:00',
    date_created_gmt: '2025-01-01T12:00:00',
    date_modified: '2025-01-01T12:00:00',
    date_modified_gmt: '2025-01-01T12:00:00',
    email: 'customer@example.com',
    first_name: 'Jane',
    last_name: 'Smith',
    role: 'customer',
    username: 'janesmith',
    billing: {
      first_name: 'Jane',
      last_name: 'Smith',
      company: 'Sample Company',
      address_1: '456 Customer Ave',
      address_2: 'Apt 2',
      city: 'Customer City',
      state: 'NY',
      postcode: '54321',
      country: 'US',
      email: 'customer@example.com',
      phone: '+0987654321'
    },
    shipping: {
      first_name: 'Jane',
      last_name: 'Smith',
      company: 'Sample Company',
      address_1: '456 Customer Ave',
      address_2: 'Apt 2',
      city: 'Customer City',
      state: 'NY',
      postcode: '54321',
      country: 'US'
    },
    is_paying_customer: true,
    avatar_url: 'https://example.com/customer-avatar.jpg',
    meta_data: [],
    _links: {}
  }
];