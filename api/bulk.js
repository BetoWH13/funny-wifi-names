// api/bulk.js
const wifiNames = require('../data/wifi-names.json');

exports.handler = async function(event, context) {
  try {
    // Get count parameter from query string, default to 5
    const count = parseInt(event.queryStringParameters?.count || 5);
    
    // Limit count to a reasonable number
    const limitedCount = Math.min(count, 20);
    
    // Get all names from all categories
    const allNames = wifiNames.categories.flatMap(category => category.names);
    
    // Select random names
    const randomNames = [];
    const namesCopy = [...allNames]; // Create a copy to avoid duplicates
    
    for (let i = 0; i < limitedCount && namesCopy.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * namesCopy.length);
      randomNames.push(namesCopy[randomIndex]);
      namesCopy.splice(randomIndex, 1); // Remove selected name to avoid duplicates
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        names: randomNames
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get WiFi names' })
    };
  }
};
