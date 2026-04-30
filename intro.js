import { auth, onAuthStateChanged, signOut, db, doc, getDoc, setDoc } from "./firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    const regionSelect = document.getElementById('region-select');
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    // 1. Initial Local State
    let currentRegion = localStorage.getItem('userRegion') || 'general';
    regionSelect.value = currentRegion;

    // 2. Auth State Listener
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in
            loginBtn.style.display = 'none';
            userInfo.style.display = 'flex';
            userName.innerText = `Hi, ${user.displayName || 'Voter'}`;

            // Load region from Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const data = userSnap.data();
                if (data.region) {
                    currentRegion = data.region;
                    regionSelect.value = currentRegion;
                    localStorage.setItem('userRegion', currentRegion);
                    if (typeof applyTheme === 'function') applyTheme(currentRegion);
                }
            } else {
                // Initialize user doc if it doesn't exist
                await setDoc(userRef, {
                    name: user.displayName,
                    email: user.email,
                    region: currentRegion
                });
            }
        } else {
            // User is signed out
            loginBtn.style.display = 'flex';
            userInfo.style.display = 'none';
        }
    });

    // 3. Handle Region Change
    regionSelect.addEventListener('change', async (e) => {
        const newRegion = e.target.value;
        localStorage.setItem('userRegion', newRegion);
        
        if (typeof applyTheme === 'function') {
            applyTheme(newRegion);
        }

        // Sync to Firestore if logged in
        const user = auth.currentUser;
        if (user) {
            await setDoc(doc(db, "users", user.uid), { region: newRegion }, { merge: true });
        }
    });

    // 4. Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => {
                window.location.reload();
            });
        });
    }
});
