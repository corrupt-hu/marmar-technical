const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const togglePassword = document.getElementById('togglePassword');
const rememberMe = document.getElementById('rememberMe');
const submitBtn = document.getElementById('submitBtn');
const googleSignInBtn = document.getElementById('googleSignIn');
const appleSignInBtn = document.getElementById('appleSignIn');

// Password visibility toggle
togglePassword.addEventListener('click', () => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    togglePassword.querySelector('i').classList.toggle('fa-eye');
    togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (validateForm()) {
        await simulateLogin();
    }
});

function validateForm() {
    let isValid = true;
    
    emailError.style.display = 'none';
    passwordError.style.display = 'none';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        emailError.style.display = 'block';
        isValid = false;
    }

    if (password.value.length < 6) {
        passwordError.style.display = 'block';
        isValid = false;
    }

    return isValid;
}

async function simulateLogin() {
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const loginData = {
            email: email.value,
            password: password.value,
            rememberMe: rememberMe.checked
        };
        
        console.log('Login successful:', loginData);
        alert('Login successful!');
        form.reset();
    } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
}

// Google Sign-In
let googleAuth;
window.onGoogleLoad = () => {
    gapi.load('auth2', () => {
        googleAuth = gapi.auth2.init({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with your Client ID
            scope: 'profile email'
        });
    });
};

googleSignInBtn.addEventListener('click', async () => {
    try {
        const googleUser = await googleAuth.signIn();
        const profile = googleUser.getBasicProfile();
        const idToken = googleUser.getAuthResponse().id_token;
        
        console.log('Google Sign-In successful:', {
            id: profile.getId(),
            name: profile.getName(),
            email: profile.getEmail(),
            idToken: idToken
        });
        alert(`Signed in with Google as: ${profile.getName()}`);
    } catch (error) {
        console.error('Google Sign-In error:', error);
        alert('Google Sign-In failed. Please try again.');
    }
});

// Apple Sign-In
window.addEventListener('load', () => {
    AppleID.auth.init({
        clientId: 'YOUR_APPLE_SERVICE_ID', // Replace with your Services ID
        scope: 'name email',
        redirectURI: window.location.origin,
        state: 'origin:web',
        usePopup: true
    });
});

appleSignInBtn.addEventListener('click', async () => {
    try {
        const data = await AppleID.auth.signIn();
        console.log('Apple Sign-In successful:', {
            user: data.user,
            idToken: data.authorization.id_token
        });
        alert(`Signed in with Apple${data.user ? ' as: ' + data.user.name.firstName + ' ' + data.user.name.lastName : ''}`);
    } catch (error) {
        console.error('Apple Sign-In error:', error);
        alert('Apple Sign-In failed. Please try again.');
    }
});

// Load saved email if "Remember Me" was checked
window.addEventListener('load', () => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        email.value = savedEmail;
        rememberMe.checked = true;
    }
});

// Save email if "Remember Me" is checked
form.addEventListener('submit', () => {
    if (rememberMe.checked) {
        localStorage.setItem('rememberedEmail', email.value);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
});