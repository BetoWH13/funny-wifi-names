// api/random.js
const wifiNames = require('../data/wifi-names.json');

exports.handler = async function(event, context) {
  try {
    // Get all names from all categories
    const allNames = wifiNames.categories.flatMap(category => category.names);
    
    // Select a random name
    const randomName = allNames[Math.floor(Math.random() * allNames.length)];
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        name: randomName
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get random WiFi name' })
    };
  }
};
