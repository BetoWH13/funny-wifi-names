// Netlify Function: bulk.js
// Returns multiple WiFi names at once (for premium users)

const wifiNames = require("../data/wifi-names.json");

exports.handler = async function(event, context) {
    const count = event.queryStringParameters.count || 5;
    const shuffled = wifiNames.sort(() => 0.5 - Math.random());
    const selectedNames = shuffled.slice(0, count);
    
    return {
        statusCode: 200,
        body: JSON.stringify({ wifi_names: selectedNames })
    };
};
