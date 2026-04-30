import { auth, onAuthStateChanged, setDoc, doc, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const form = document.getElementById('auth-form');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const nameGroup = document.getElementById('name-group');
const submitBtn = document.getElementById('submit-btn');
const errorMsg = document.getElementById('error-msg');
const authDesc = document.getElementById('auth-desc');

let isLogin = true;

// --- TAB SWITCHING ---
tabLogin.onclick = () => {
    isLogin = true;
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    nameGroup.style.display = 'none';
    authDesc.innerText = "Welcome back to the future of voting.";
    submitBtn.innerText = "Login";
    errorMsg.style.display = 'none';
};

tabSignup.onclick = () => {
    isLogin = false;
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    nameGroup.style.display = 'block';
    authDesc.innerText = "Join Voxara and start your democratic journey.";
    submitBtn.innerText = "Create Account";
    errorMsg.style.display = 'none';
};

// --- FORM SUBMISSION ---
form.onsubmit = async (e) => {
    e.preventDefault();
    errorMsg.style.display = 'none';
    
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name').value;

    try {
        if (isLogin) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update profile with name
            await updateProfile(user, { displayName: name });
            
            // Initialize user doc in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                region: 'general',
                createdAt: new Date().toISOString()
            });
        }
        // Redirect on success
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Auth Error:", error.code);
        errorMsg.innerText = getErrorMessage(error.code);
        errorMsg.style.display = 'block';
    }
};

function getErrorMessage(code) {
    switch (code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Incorrect email or password.';
        case 'auth/email-already-in-use':
            return 'This email is already registered.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
}

// Check if already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = 'index.html';
    }
});
