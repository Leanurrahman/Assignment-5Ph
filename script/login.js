// ================= CONFIGURATION =================
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123"
};

// ================= MAIN INITIALIZATION =================
// পেজ লোড হলে এই ফাংশনটি কল হবে
document.addEventListener('DOMContentLoaded', () => {
    
    // চেক করা আমরা কোন পেজে আছি
    const isLoginPage = document.getElementById('login-form') !== null;
    const isIndexPage = !isLoginPage; // যদি লগইন ফর্ম না থাকে, তবে ধরে নিচ্ছি এটি ইনডেক্স পেজ

    if (isLoginPage) {
        initLogin();
    } else if (isIndexPage) {
        initIndexPage();
    }
});

// ================= LOGIN LOGIC =================
function initLogin() {
    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // পেজ রিলোড বন্ধ করা
            
            const userIn = document.getElementById('username').value.trim();
            const passIn = document.getElementById('password').value.trim();

            // ক্রেডেনশিয়াল চেক
            if (userIn === ADMIN_CREDENTIALS.username && passIn === ADMIN_CREDENTIALS.password) {
                // সফল হলে এরর লুকানো
                if(errorMsg) errorMsg.classList.add('hidden');
                
                // ইনডেক্স পেজে রিডাইরেক্ট (URL প্যারামিটার সহ)
                window.location.href = 'index.html?user=' + encodeURIComponent(ADMIN_CREDENTIALS.username);
            } else {
                // ভুল হলে এরর দেখানো
                if(errorMsg) errorMsg.classList.remove('hidden');
                
                // পাসওয়ার্ড ক্লিয়ার করা
                const passField = document.getElementById('password');
                if(passField) {
                    passField.value = '';
                    passField.focus();
                }
            }
        });
    }
}

// ================= INDEX PAGE SECURITY =================
function initIndexPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUser = urlParams.get('user');

    // সিকিউরিটি চেক: ইউজার আছে কিনা এবং সে admin কিনা
    if (!currentUser || currentUser !== ADMIN_CREDENTIALS.username) {
        // না হলে লগইন পেজে পাঠিয়ে দাও
        window.location.href = 'login.html';
        return;
    }

    // সফল হলে কনসোলে মেসেজ
    console.log(`Welcome back, ${currentUser}!`);
    
    // চাইলে এখানে ডাইনামিকভাবে নাম দেখানোর কোড যোগ করতে পারেন
    // উদাহরণ: document.getElementById('welcome-text').innerText = `Hello ${currentUser}`;
}
