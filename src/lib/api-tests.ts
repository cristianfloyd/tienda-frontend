/**
 * API connectivity test scripts for WordPress and WooCommerce
 * Used to validate API connections and response formats
 */

import { wpAPI } from './wordpress-api';
import { wcAPI } from './woocommerce-api';
import type { WordPressPost, WooCommerceProduct } from '../types';

interface APITestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Test WordPress REST API connectivity
 */
export async function testWordPressAPI(): Promise<APITestResult> {
  try {
    // Test basic connectivity
    const posts = await wpAPI.getPosts({ per_page: '1' });
    
    if (!Array.isArray(posts)) {
      return {
        success: false,
        message: 'WordPress API: Invalid response format - expected array',
        error: 'Response is not an array'
      };
    }

    return {
      success: true,
      message: 'WordPress API: Connection successful',
      data: {
        postsCount: posts.length,
        samplePost: posts[0] ? {
          id: posts[0].id,
          title: posts[0].title?.rendered,
          status: posts[0].status
        } : null
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'WordPress API: Connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Test WooCommerce API authentication and connectivity
 */
export async function testWooCommerceAPI(): Promise<APITestResult> {
  try {
    // Test WooCommerce API authentication
    const products = await wcAPI.getProducts({ per_page: '1' });
    
    if (!Array.isArray(products)) {
      return {
        success: false,
        message: 'WooCommerce API: Invalid response format - expected array',
        error: 'Response is not an array'
      };
    }

    return {
      success: true,
      message: 'WooCommerce API: Authentication and connection successful',
      data: {
        productsCount: products.length,
        sampleProduct: products[0] ? {
          id: products[0].id,
          name: products[0].name,
          price: products[0].price,
          status: products[0].status
        } : null
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'WooCommerce API: Authentication or connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Test CORS configuration between frontend and backend
 */
export async function testCORSConfiguration(): Promise<APITestResult> {
  try {
    const wpResult = await testWordPressAPI();
    const wcResult = await testWooCommerceAPI();
    
    if (wpResult.success && wcResult.success) {
      return {
        success: true,
        message: 'CORS: Frontend-backend communication working correctly'
      };
    }

    return {
      success: false,
      message: 'CORS: Configuration issues detected',
      error: `WordPress: ${wpResult.success ? 'OK' : 'Failed'}, WooCommerce: ${wcResult.success ? 'OK' : 'Failed'}`
    };
  } catch (error) {
    return {
      success: false,
      message: 'CORS: Unable to test configuration',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Validate API response format matches expected interface types
 */
export async function validateAPIResponseFormat(): Promise<APITestResult> {
  try {
    const [wpResult, wcResult] = await Promise.all([
      testWordPressAPI(),
      testWooCommerceAPI()
    ]);

    const validationResults: string[] = [];

    // Validate WordPress response format
    if (wpResult.success && wpResult.data?.samplePost) {
      const post = wpResult.data.samplePost;
      const hasRequiredFields = typeof post.id === 'number' && 
                               typeof post.title === 'string' && 
                               typeof post.status === 'string';
      
      if (hasRequiredFields) {
        validationResults.push('WordPress response format: ✓ Valid');
      } else {
        validationResults.push('WordPress response format: ✗ Invalid structure');
      }
    }

    // Validate WooCommerce response format
    if (wcResult.success && wcResult.data?.sampleProduct) {
      const product = wcResult.data.sampleProduct;
      const hasRequiredFields = typeof product.id === 'number' && 
                               typeof product.name === 'string' && 
                               typeof product.status === 'string';
      
      if (hasRequiredFields) {
        validationResults.push('WooCommerce response format: ✓ Valid');
      } else {
        validationResults.push('WooCommerce response format: ✗ Invalid structure');
      }
    }

    return {
      success: validationResults.length > 0,
      message: 'API Response Format Validation Results',
      data: {
        results: validationResults,
        wpTest: wpResult,
        wcTest: wcResult
      }
    };
  } catch (error) {
    return {
      success: false,
      message: 'API response validation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Run all API connectivity tests
 */
export async function runAllAPITests(): Promise<{
  wordpress: APITestResult;
  woocommerce: APITestResult;
  cors: APITestResult;
  validation: APITestResult;
}> {
  const [wordpress, woocommerce, cors, validation] = await Promise.all([
    testWordPressAPI(),
    testWooCommerceAPI(),
    testCORSConfiguration(),
    validateAPIResponseFormat()
  ]);

  return {
    wordpress,
    woocommerce,
    cors,
    validation
  };
}