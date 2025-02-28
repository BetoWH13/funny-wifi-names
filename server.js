const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// API handlers
const randomHandler = require('./api/random');
const bulkHandler = require('./api/bulk');
const categoriesHandler = require('./api/categories');

const PORT = process.env.PORT || 8888;

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create the server
const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Handle API requests
  if (pathname.startsWith('/api/')) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }
    
    // Route API requests
    if (pathname === '/api/random') {
      // Simulate Netlify function event object
      const event = {
        path: pathname,
        httpMethod: req.method,
        queryStringParameters: parsedUrl.query
      };
      
      // Call the handler and send response
      randomHandler.handler(event)
        .then(response => {
          res.statusCode = response.statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(response.body);
        })
        .catch(error => {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        });
      
      return;
    } else if (pathname === '/api/bulk') {
      const event = {
        path: pathname,
        httpMethod: req.method,
        queryStringParameters: parsedUrl.query
      };
      
      bulkHandler.handler(event)
        .then(response => {
          res.statusCode = response.statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(response.body);
        })
        .catch(error => {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        });
      
      return;
    } else if (pathname === '/api/categories') {
      const event = {
        path: pathname,
        httpMethod: req.method,
        queryStringParameters: parsedUrl.query
      };
      
      categoriesHandler.handler(event)
        .then(response => {
          res.statusCode = response.statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(response.body);
        })
        .catch(error => {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        });
      
      return;
    } else {
      // API endpoint not found
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'API endpoint not found' }));
      return;
    }
  }
  
  // Serve static files from the public directory
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  
  // Get the file extension
  const extname = path.extname(filePath);
  
  // Set the content type based on the file extension
  const contentType = MIME_TYPES[extname] || 'text/plain';
  
  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
          if (err) {
            res.statusCode = 500;
            res.end('Error loading index.html');
          } else {
            res.setHeader('Content-Type', 'text/html');
            res.end(content);
          }
        });
      } else {
        // Server error
        res.statusCode = 500;
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      res.setHeader('Content-Type', contentType);
      res.end(content);
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`API endpoints:`);
  console.log(`- http://localhost:${PORT}/api/random`);
  console.log(`- http://localhost:${PORT}/api/bulk?count=5`);
  console.log(`- http://localhost:${PORT}/api/categories`);
  console.log(`- http://localhost:${PORT}/api/categories?name=food`);
});
