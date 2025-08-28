#!/usr/bin/env node

/**
 * Simple test script to verify the blog API endpoints
 * Run with: node test-api.js
 */

const http = require('http');

const baseUrl = 'http://localhost:3000';

async function testEndpoint(path, expectedStatus = 200) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}${path}`;
    console.log(`Testing: ${url}`);
    
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          const success = res.statusCode === expectedStatus;
          
          console.log(`Status: ${res.statusCode} ${success ? '✓' : '✗'}`);
          console.log(`Response:`, JSON.stringify(jsonData, null, 2));
          console.log('---');
          
          resolve({ success, data: jsonData, status: res.statusCode });
        } catch (error) {
          console.log(`Status: ${res.statusCode} ✗ (Invalid JSON)`);
          console.log(`Raw response:`, data);
          console.log('---');
          resolve({ success: false, data: null, status: res.statusCode });
        }
      });
    }).on('error', (err) => {
      console.log(`Error: ${err.message} ✗`);
      console.log('---');
      reject(err);
    });
  });
}

async function runTests() {
  console.log('🧪 Testing Blog API Endpoints\n');
  console.log('Make sure your development server is running on http://localhost:3000\n');
  
  try {
    // Test main blogs endpoint
    await testEndpoint('/api/blogs');
    
    // Test blogs endpoint with limit
    await testEndpoint('/api/blogs?limit=2');
    
    // Test invalid limit
    await testEndpoint('/api/blogs?limit=invalid', 400);
    
    console.log('✅ API tests completed!');
    console.log('\nIf you see 500 errors, make sure your .env.local file is configured correctly.');
    console.log('Check BLOG_API_SETUP.md for setup instructions.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure your development server is running: npm run dev');
  }
}

runTests();
