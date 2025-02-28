// Netlify Function: random.js
// This function returns a random funny WiFi name from a JSON file.

const wifiNames = require("../data/wifi-names.json");

exports.handler = async function(event, context) {
    const randomName = wifiNames[Math.floor(Math.random() * wifiNames.length)];
    
    return {
        statusCode: 200,
        body: JSON.stringify({ wifi_name: randomName })
    };
};
