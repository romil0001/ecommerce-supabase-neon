import { createClient } from '@supabase/supabase-js';
import { Pool } from '@neondatabase/serverless';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create a pool to connect to the Neon PostgreSQL database
const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });

/**
 * Insert or update a customer preference in Supabase
 * @param {string} userId - The user identifier
 * @param {object} preference - A JSON object representing user preferences
 */
export async function savePreference(userId, preference) {
  const { data, error } = await supabase.from('preferences').upsert({
    user_id: userId,
    preference: JSON.stringify(preference),
  });
  if (error) throw error;
  return data;
}

/**
 * Retrieve customer details from the Neon database
 * @param {string} userId - The user identifier
 * @returns {Promise<Array>} rows containing customer details
 */
export async function getCustomerDetails(userId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM customers WHERE id = $1',
      [userId]
    );
    return result.rows;
  } finally {
    client.release();
  }
}

// Example usage (uncomment to test)
// (async () => {
//   const userDetails = await getCustomerDetails('123');
//   console.log('Customer details:', userDetails);
//   await savePreference('123', { theme: 'dark', notifications: true });
// })();
