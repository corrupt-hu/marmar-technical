const form = document.getElementById('signupForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const togglePassword = document.getElementById('togglePassword');
const submitBtn = document.getElementById('submitBtn');
const googleSignInBtn = document.getElementById('googleSignIn');
const appleSignInBtn = document.getElementById('appleSignIn');

// Password visibility toggle
togglePassword.addEventListener('click', () => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    confirmPassword.setAttribute('type', type);
    togglePassword.querySelector('i').classList.toggle('fa-eye');
    togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (validateForm()) {
        await simulateSignup();
    }
});

function validateForm() {
    let isValid = true;
    
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    confirmPasswordError.style.display = 'none';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        emailError.style.display = 'block';
        isValid = false;
    }

    if (password.value.length < 6) {
        passwordError.style.display = 'block';
        isValid = false;
    }

    if (password.value !== confirmPassword.value) {
        confirmPasswordError.style.display = 'block';
        isValid = false;
    }

    return isValid;
}

async function simulateSignup() {
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const signupData = {
            email: email.value,
            password: password.value
        };
        
        console.log('Signup successful:', signupData);
        form.classList.add('success');
        setTimeout(() => {
            alert('Signup successful! Please log in.');
            window.location.href = '/index.html';
        }, 300);
    } catch (error) {
        console.error('Signup failed:', error);
        alert('Signup failed. Please try again.');
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
        
        console.log('Google Sign-Up successful:', {
            id: profile.getId(),
            name: profile.getName(),
            email: profile.getEmail(),
            idToken: idToken
        });
        googleSignInBtn.classList.add('success');
        setTimeout(() => {
            alert(`Signed up with Google as: ${profile.getName()}`);
            window.location.href = '/index.html';
        }, 300);
    } catch (error) {
        console.error('Google Sign-Up error:', error);
        alert('Google Sign-Up failed. Please try again.');
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
        console.log('Apple Sign-Up successful:', {
            user: data.user,
            idToken: data.authorization.id_token
        });
        appleSignInBtn.classList.add('success');
        setTimeout(() => {
            alert(`Signed up with Apple${data.user ? ' as: ' + data.user.name.firstName + ' ' + data.user.name.lastName : ''}`);
            window.location.href = '/index.html';
        }, 300);
    } catch (error) {
        console.error('Apple Sign-Up error:', error);
        alert('Apple Sign-Up failed. Please try again.');
    }
});