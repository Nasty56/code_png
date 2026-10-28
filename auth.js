let isLogin = true;
const title = document.getElementById('authTitle');
const btn = document.getElementById('authBtn');
const switchMode = document.getElementById('switchMode');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

switchMode.addEventListener('click', () => {
    isLogin = !isLogin;
    title.textContent = isLogin ? 'Вход' : 'Регистрация';
    btn.textContent = isLogin ? 'Войти' : 'Зарегистрироваться';
    switchMode.textContent = isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти';
});

btn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const url = isLogin ? 'http://127.0.0.1:5000/api/login' : 'http://127.0.0.1:5000/api/register';

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
        if (isLogin) {
            localStorage.setItem('myBoardUserId', data.userId);
            localStorage.setItem('myBoardEmail', data.email);
            window.location.href = 'index.html';
        } else {
            alert('Регистрация успешна! Теперь войдите.');
            switchMode.click();
        }
    } else {
        alert(data.error);
    }
});