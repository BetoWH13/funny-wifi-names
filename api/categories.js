// Netlify Function: categories.js
// Returns WiFi names by category (e.g., "tech", "movies", "puns")

const wifiNames = require("../data/wifi-names.json");
const categorizedNames = require("../data/wifi-categories.json");

exports.handler = async function(event, context) {
    // Check if a specific category was requested
    const categoryName = event.queryStringParameters?.name;
    
    if (categoryName) {
        // Return names for a specific category
        if (!categorizedNames[categoryName]) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: `Category '${categoryName}' not found` })
            };
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify({ names: categorizedNames[categoryName] })
        };
    } else {
        // Return all categories (names only, not the WiFi names)
        const categoryList = Object.keys(categorizedNames).map(name => ({
            name: name,
            count: categorizedNames[name].length
        }));
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                categories: categoryList
            })
        };
    }
};
