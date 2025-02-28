// api/categories.js
const wifiNames = require('../data/wifi-names.json');

exports.handler = async function(event, context) {
  try {
    // Check if a specific category was requested
    const categoryName = event.queryStringParameters?.name;
    
    if (categoryName) {
      // Find the requested category
      const category = wifiNames.categories.find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      
      if (!category) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: `Category '${categoryName}' not found` })
        };
      }
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(category)
      };
    } else {
      // Return all categories (names only, not the WiFi names)
      const categoryList = wifiNames.categories.map(cat => ({
        name: cat.name,
        count: cat.names.length
      }));
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          categories: categoryList
        })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get categories' })
    };
  }
};
