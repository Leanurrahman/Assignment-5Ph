
const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123"
};

document.addEventListener('DOMContentLoaded', () => {
    // check korci amra kon page e achi
    const path = window.location.pathname;
    const isHomePage = path.includes('home.html');

    if (!isHomePage) {
        initLogin();
    } else {
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

    if (!currentUser || currentUser !== ADMIN_CREDENTIALS.username) {
        window.location.href = 'index.html';
        return;
    }

    console.log(`Welcome back, ${currentUser}!`);
}