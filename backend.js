const supabaseUrl = 'https://oczivddwxmgjygzqfnxv.supabase.co';
const supabaseKey = 'your-anon-key';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
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
        localStorage.setItem('user', JSON.stringify(data.user));
        e.target.reset(); // Clear form fields
        window.location.href = 'vibe.html';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

// Handle signup
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.elements[0].value;
    const email = e.target.elements[1].value;
    const password = e.target.elements[2].value;

    // Input validation
    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });

        if (error) throw error;

        await supabase
            .from('user_streaks')
            .insert([{ 
                user_id: data.user.id,
                current_streak: 0,
                best_streak: 0
            }]);

        alert('Signup successful! Please check your email.');
        e.target.reset(); // Clear form fields
    } catch (error) {
        alert('Signup failed: ' + error.message);
    }
});

// Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}