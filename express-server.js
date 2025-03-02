const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

const logFile = 'logs.txt';
const usersFile = 'users.json';

// Simple function to log data
const logRequest = (ip, status) => {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - IP: ${ip} - Status: ${status}\n`;

    fs.appendFile(logFile, logEntry, (err) => {
        if (err) console.error("Logging error:", err);
    });
};

// Function to read users from JSON file
const getUsers = () => {
    try {
        const data = fs.readFileSync(usersFile, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading users file:", err);
        return { users: [] };
    }
};

// Authentication middleware
const authenticate = (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    
    const userData = getUsers();
    const user = userData.users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        logRequest(req.ip, "LOGIN FAILED");
        return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Authentication successful
    logRequest(req.ip, `LOGIN SUCCESS - User: ${username}`);
    req.user = user;
    next();
};

// Rate Limiter Middleware
const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 10, // Free users get 10 requests per day
    keyGenerator: (req) => req.ip,
    handler: (req, res) => {
        logRequest(req.ip, "RATE LIMIT EXCEEDED");
        res.status(429).json({ error: "Rate limit exceeded. Upgrade for more access!" });
    }
});

// Apply rate limiter to API endpoints
app.use('/api/random', limiter);

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }
    
    const userData = getUsers();
    const user = userData.users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        logRequest(req.ip, "LOGIN FAILED");
        return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Authentication successful
    logRequest(req.ip, `LOGIN SUCCESS - User: ${username}`);
    
    // Return user info (excluding password)
    const { password: _, ...userInfo } = user;
    res.json({ 
        message: "Login successful", 
        user: userInfo 
    });
});

// Protected API Route (requires authentication)
app.post('/api/protected/random', authenticate, (req, res) => {
    const wifiNames = [
        "LAN Solo", "Pretty Fly for a Wi-Fi", "The LAN Before Time",
        "It Hurts When IP", "Winternet is Coming", "FBI Surveillance Van",
        "The Promised LAN", "Nacho WiFi", "Wu-Tang LAN", "Hide Yo Kids, Hide Yo WiFi"
    ];

    const randomName = wifiNames[Math.floor(Math.random() * wifiNames.length)];
    logRequest(req.ip, `PROTECTED REQUEST - User: ${req.user.username}`);
    res.json({ 
        wifi_name: randomName,
        user: req.user.username,
        role: req.user.role
    });
});

// Public API Route
app.get('/api/random', (req, res) => {
    const wifiNames = [
        "LAN Solo", "Pretty Fly for a Wi-Fi", "The LAN Before Time",
        "It Hurts When IP", "Winternet is Coming", "FBI Surveillance Van",
        "The Promised LAN", "Nacho WiFi", "Wu-Tang LAN", "Hide Yo Kids, Hide Yo WiFi"
    ];

    const randomName = wifiNames[Math.floor(Math.random() * wifiNames.length)];
    logRequest(req.ip, "PUBLIC REQUEST SUCCESSFUL");
    res.json({ wifi_name: randomName });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
