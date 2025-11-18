// backend.js

// 1. Supabase Initialization (FIXED)
const supabaseUrl = 'https://oczivddwxmgjygzqfnxv.supabase.co';
// IMPORTANT: Replace 'your-anon-key' with your actual Supabase Anon Public Key
const supabaseKey = 'your-anon-key'; 

// FIX: Access the createClient function from the globally exposed 'supabase' object
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


// 2. Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}


// 3. Handle Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Ensure input fields are correctly targeted (assuming structure: [username, password])
    // The login form only uses email and password, so we use the first two elements.
    // NOTE: The HTML you provided uses 'Username' for the first field, but the JS expects email.
    const email = e.target.elements[0].value; 
    const password = e.target.elements[1].value;

    // Input validation
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });    
        
        if (error) throw error;
        
        // Check if data.user exists before setting localStorage
        if (data && data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            e.target.reset(); // Clear form fields
            window.location.href = 'vibe.html'; // Redirect upon successful login
        } else {
             // Handle cases where sign-in is successful but user data is missing (unlikely, but safe)
            alert('Login successful, but user session not fully established.');
        }

    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});


// 4. Handle Signup
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Elements: [Username, Email, Password]
    const username = e.target.elements[0].value;
    const email = e.target.elements[1].value;
    const password = e.target.elements[2].value;

    // Input validation
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    try {
        // Sign up the user via Email/Password
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Store the username in the user's metadata
                data: { username } 
            }
        });

        if (signupError) throw signupError;
        
        // If sign-up is successful, insert the initial streak data
        if (signupData && signupData.user) {
            await supabase
                .from('user_streaks')
                .insert([{    
                    user_id: signupData.user.id,
                    current_streak: 0,
                    best_streak: 0
                }]);

            alert('Signup successful! Please check your email to confirm your account.');
            e.target.reset(); // Clear form fields
        } else {
            // Handle case where no user object is returned (e.g., if confirmation is required)
            alert('Signup initiated. Please check your email for a confirmation link.');
            e.target.reset(); 
        }

    } catch (error) {
        alert('Signup failed: ' + error.message);
    }
});


// 5. Tab Switching Logic (Adding this ensures the forms are visible)
document.getElementById('signupTab').onclick = function() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('signupTab').classList.add('active');
};
document.getElementById('loginTab').onclick = function() {
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('signupTab').classList.remove('active');
    document.getElementById('loginTab').classList.add('active');
};
