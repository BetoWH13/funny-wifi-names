// Netlify Function: random.js
// This function returns a random funny WiFi name from a JSON file.

const wifiNames = require("../data/wifi-names.json");
const { rateLimitMiddleware } = require("./utils/rate-limiter");

exports.handler = async function(event, context) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimitMiddleware(event);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }
    
    const randomName = wifiNames[Math.floor(Math.random() * wifiNames.length)];
    
    return {
        statusCode: 200,
        body: JSON.stringify({ name: randomName })
    };
};
