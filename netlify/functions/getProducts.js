// Netlify serverless function to fetch products from Neon database
const { Pool } = require('@neondatabase/serverless');

// Create a connection pool. The connection string is provided via environment variable
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
});

exports.handler = async function(event, context) {
  // Enable CORS for browser requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  try {
    const client = await pool.connect();
    // Query products table. Adjust table/column names as per your Neon schema
    const result = await client.query('SELECT id, name, price FROM products LIMIT 10;');
    client.release();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.rows),
    };
  } catch (error) {
    console.error('Error querying Neon DB:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
