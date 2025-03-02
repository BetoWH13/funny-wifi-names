// Test script for rate limiting functionality
// Run with: node tests/rate-limit-test.js

const http = require('http');

// Configuration
const API_ENDPOINT = 'http://localhost:8888/.netlify/functions/random';
const REQUESTS_TO_SEND = 12; // Send 12 requests (2 more than the limit)

// Function to make an API request
function makeRequest(index) {
  return new Promise((resolve, reject) => {
    const req = http.get(API_ENDPOINT, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Request ${index + 1}: Status ${res.statusCode}`);
        try {
          const jsonData = JSON.parse(data);
          console.log(`Response: ${JSON.stringify(jsonData)}`);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          console.log(`Response: ${data}`);
          resolve({ status: res.statusCode, data });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`Request ${index + 1} error:`, error);
      reject(error);
    });
    
    req.end();
  });
}

// Run the test
async function runTest() {
  console.log(`Testing rate limiting with ${REQUESTS_TO_SEND} requests...`);
  console.log(`API Endpoint: ${API_ENDPOINT}`);
  console.log('--------------------------------------');
  
  const results = {
    success: 0,
    rateLimited: 0,
    errors: 0
  };
  
  for (let i = 0; i < REQUESTS_TO_SEND; i++) {
    try {
      const response = await makeRequest(i);
      
      if (response.status === 200) {
        results.success++;
      } else if (response.status === 429) {
        results.rateLimited++;
      } else {
        results.errors++;
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.errors++;
    }
  }
  
  console.log('--------------------------------------');
  console.log('Test Results:');
  console.log(`- Successful requests: ${results.success}`);
  console.log(`- Rate limited requests: ${results.rateLimited}`);
  console.log(`- Errors: ${results.errors}`);
  console.log('--------------------------------------');
  
  if (results.rateLimited > 0) {
    console.log('✅ Rate limiting is working!');
  } else {
    console.log('❌ Rate limiting does not appear to be working.');
  }
}

runTest();
