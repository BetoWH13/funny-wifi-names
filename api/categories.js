// Netlify Function: categories.js
// Returns WiFi names by category (e.g., "tech", "movies", "puns")

const wifiNames = require("../data/wifi-names.json");
const categorizedNames = require("../data/wifi-categories.json");

exports.handler = async function(event, context) {
    const category = event.queryStringParameters.category || "all";
    
    if (category === "all") {
        return {
            statusCode: 200,
            body: JSON.stringify({ wifi_names: wifiNames })
        };
    }
    
    if (!categorizedNames[category]) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Invalid category." })
        };
    }
    
    return {
        statusCode: 200,
        body: JSON.stringify({ wifi_names: categorizedNames[category] })
    };
};
