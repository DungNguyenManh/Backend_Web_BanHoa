#!/usr/bin/env node

/**
 * Script test API sau khi deploy
 * Sử dụng: node scripts/test-deployment.js https://your-app.vercel.app
 */

const https = require('https');
const http = require('http');

const API_BASE_URL = process.argv[2] || 'http://localhost:3000';

console.log(`🧪 Testing API deployment: ${API_BASE_URL}\n`);

const makeRequest = (url, options = {}) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null
          });
        } catch {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
};

const tests = [
  {
    name: 'Health Check',
    url: `${API_BASE_URL}/api/health`,
    method: 'GET'
  },
  {
    name: 'Health Ping',
    url: `${API_BASE_URL}/api/health/ping`,
    method: 'GET'
  },
  {
    name: 'Get Categories',
    url: `${API_BASE_URL}/api/categories`,
    method: 'GET'
  },
  {
    name: 'Get Flowers',
    url: `${API_BASE_URL}/api/flowers`,
    method: 'GET'
  },
  {
    name: 'SEO Metadata',
    url: `${API_BASE_URL}/api/flowers/seo-metadata`,
    method: 'GET'
  },
  {
    name: 'Sitemap',
    url: `${API_BASE_URL}/api/flowers/sitemap`,
    method: 'GET'
  }
];

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`⏳ Testing: ${test.name}...`);
      const result = await makeRequest(test.url, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Deployment-Test-Script'
        }
      });

      if (result.status >= 200 && result.status < 300) {
        console.log(`✅ ${test.name} - Status: ${result.status}`);
        if (result.data) {
          console.log(`   Response: ${JSON.stringify(result.data).substring(0, 100)}...`);
        }
        passed++;
      } else {
        console.log(`❌ ${test.name} - Status: ${result.status}`);
        if (result.data) {
          console.log(`   Error: ${JSON.stringify(result.data)}`);
        }
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Error: ${error.message}`);
      failed++;
    }
    console.log('');
  }

  console.log('='.repeat(50));
  console.log(`📊 Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! API is working correctly!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the deployment.');
  }
}

runTests();
