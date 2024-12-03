document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const response = await fetch('process_registration.php', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            // Redirect to login page after successful registration
            window.location.href = 'login.html';
        } else {
            // Handle errors
            console.error('Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}); 