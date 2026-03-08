// script/login.js

const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123"
};

document.addEventListener('DOMContentLoaded', () => {
    // চেক করছি আমরা কোন পেজে আছি
    const path = window.location.pathname;
    const isHomePage = path.includes('home.html');

    if (!isHomePage) {
        // যদি home.html না হয়, তাহলে এটি লগইন পেজ (index.html)
        initLogin();
    } else {
        // এটি হোম পেজ (home.html)
        initHomePage();
    }
});

function initLogin() {
    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const userIn = document.getElementById('username').value.trim();
        const passIn = document.getElementById('password').value.trim();

        if (userIn === ADMIN_CREDENTIALS.username && passIn === ADMIN_CREDENTIALS.password) {
            if(errorMsg) errorMsg.classList.add('hidden');
            
            // সফল হলে home.html এ রিডাইরেক্ট করো
            window.location.href = 'home.html?user=' + encodeURIComponent(ADMIN_CREDENTIALS.username);
        } else {
            if(errorMsg) errorMsg.classList.remove('hidden');
            const passField = document.getElementById('password');
            if(passField) {
                passField.value = '';
                passField.focus();
            }
        }
    });
}

function initHomePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentUser = urlParams.get('user');

    // যদি ইউজার লগইন না করে সরাসরি home.html এ আসে
    if (!currentUser || currentUser !== ADMIN_CREDENTIALS.username) {
        // তাকে index.html (লগইন পেজ) এ পাঠাও
        window.location.href = 'index.html';
        return;
    }

    console.log(`Welcome back, ${currentUser}!`);
}