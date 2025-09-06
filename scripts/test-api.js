#!/usr/bin/env node

/**
 * API connectivity test runner
 * Usage: node scripts/test-api.js
 */

require('dotenv').config({ path: '.env.local' });

const { runAllAPITests } = require('../src/lib/api-tests.ts');

async function main() {
  console.log('🧪 Running API connectivity tests...\n');

  // Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_WORDPRESS_URL',
    'NEXT_PUBLIC_WC_CONSUMER_KEY',
    'NEXT_PUBLIC_WC_CONSUMER_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease copy .env.example to .env.local and configure your API credentials.\n');
    process.exit(1);
  }

  try {
    const results = await runAllAPITests();
    
    // Display results
    console.log('📊 Test Results:');
    console.log('─'.repeat(50));
    
    Object.entries(results).forEach(([testName, result]) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${testName.toUpperCase()}: ${result.message}`);
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      
      if (result.data) {
        console.log(`   Data: ${JSON.stringify(result.data, null, 2)}`);
      }
      
      console.log('');
    });
    
    // Overall status
    const allPassed = Object.values(results).every(result => result.success);
    
    if (allPassed) {
      console.log('🎉 All API tests passed! Your WordPress/WooCommerce integration is ready.');
    } else {
      console.log('⚠️  Some tests failed. Please check your API configuration.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Test runner failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}