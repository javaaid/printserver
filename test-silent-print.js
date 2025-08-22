#!/usr/bin/env node

const http = require('http');

// Test data
const testCases = [
  {
    name: 'HTML Content Test',
    data: {
      html: '<h1>Test Print Job</h1><p>This is a test of the silent print endpoint with HTML content.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
      options: {
        copies: 1,
        format: 'pdf'
      }
    }
  },
  {
    name: 'URL Test',
    data: {
      url: 'https://httpbin.org/html',
      options: {
        format: 'png',
        width: 800,
        height: 600,
        copies: 1
      }
    }
  },
  {
    name: 'Invalid Payload Test (should fail with 400)',
    data: {
      html: '<h1>Test</h1>',
      url: 'https://example.com', // Both HTML and URL provided - should fail
      options: {
        copies: 1
      }
    }
  },
  {
    name: 'Receipt Template Test',
    data: {
      html: `
        <div style="width: 300px; font-family: monospace; text-align: center; padding: 20px;">
          <h2>RECEIPT</h2>
          <hr>
          <p>Date: ${new Date().toISOString().split('T')[0]}</p>
          <p>Time: ${new Date().toTimeString().split(' ')[0]}</p>
          <hr>
          <div style="text-align: left;">
            <p>1x Test Product A.........$10.00</p>
            <p>2x Test Product B.........$25.00</p>
            <p>1x Test Product C...........$5.00</p>
          </div>
          <hr>
          <p><strong>Total: $40.00</strong></p>
          <hr>
          <p>Thank you for your purchase!</p>
          <p>Visit us again soon!</p>
        </div>
      `,
      options: {
        format: 'png',
        width: 384,
        height: 800,
        copies: 1
      }
    }
  }
];

async function makeRequest(testCase) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testCase.data);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/print/silent',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: response
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Silent Print Endpoint Tests\n');
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`${i + 1}. ${testCase.name}`);
    console.log('=' .repeat(50));
    
    try {
      const startTime = Date.now();
      const response = await makeRequest(testCase);
      const duration = Date.now() - startTime;
      
      console.log(`Status: ${response.statusCode}`);
      console.log(`Duration: ${duration}ms`);
      console.log('Response:');
      console.log(JSON.stringify(response.body, null, 2));
      
      if (response.statusCode === 200 && response.body.success) {
        console.log('✅ Test PASSED');
      } else if (testCase.name.includes('should fail') && response.statusCode >= 400) {
        console.log('✅ Test PASSED (expected failure)');
      } else {
        console.log('❌ Test FAILED');
      }
      
    } catch (error) {
      console.log('❌ Test ERROR:', error.message);
    }
    
    console.log('\n');
  }
}

// Health check first
async function checkHealth() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', () => reject(false));
    req.setTimeout(5000, () => reject(false));
    req.end();
  });
}

async function main() {
  console.log('🔍 Checking if server is running...');
  
  try {
    const isHealthy = await checkHealth();
    if (!isHealthy) {
      console.log('❌ Server is not running or not healthy');
      console.log('Please start the server first with: npm start');
      process.exit(1);
    }
    
    console.log('✅ Server is running and healthy\n');
    await runTests();
    
    console.log('🏁 Tests completed!');
    console.log('\nTo check job status, use:');
    console.log('curl http://localhost:3000/api/print/jobs');
    
  } catch (error) {
    console.log('❌ Failed to connect to server');
    console.log('Please make sure the server is running on localhost:3000');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
