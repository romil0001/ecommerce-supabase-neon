// Front-end logic for ecommerce demo using Supabase and Neon
// Replace the placeholders with your actual Supabase project URL and anon key.
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Sign up new users
const signupButton = document.getElementById('signup');
signupButton.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert(error.message);
  } else {
    alert('Signup successful! Please check your email for confirmation.');
  }
});

// Log in existing users
const loginButton = document.getElementById('login');
loginButton.addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert(error.message);
  } else {
    // Show preferences and products sections after login
    document.getElementById('preferences').style.display = 'block';
    document.getElementById('products').style.display = 'block';
    // Fetch products from serverless function
    fetchProducts();
  }
});

// Save user preferences to Supabase
const savePrefButton = document.getElementById('savePreference');
savePrefButton.addEventListener('click', async () => {
  const preference = document.getElementById('preference').value;
  // Get currently logged in user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) {
    alert(userError.message);
    return;
  }
  // Insert preference into 'preferences' table (ensure this table exists in your Supabase project)
  const { error } = await supabase.from('preferences').insert({ user_id: user.id, preference });
  if (error) {
    alert(error.message);
  } else {
    alert('Preference saved!');
  }
});

// Fetch products from Netlify function (which queries Neon database)
async function fetchProducts() {
  try {
    const response = await fetch('/.netlify/functions/getProducts');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const products = await response.json();
    const list = document.getElementById('productList');
    list.innerHTML = '';
    products.forEach(product => {
      const li = document.createElement('li');
      li.textContent = `${product.name} - $${product.price}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert('Error fetching products');
  }
}
