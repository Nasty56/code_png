const userId = localStorage.getItem('myBoardUserId');
if (!userId) window.location.href = 'auth.html';

const codeInput = document.getElementById('codeInput');
const languageSelect = document.getElementById('languageSelect');
const themeSelect = document.getElementById('themeSelect');
const codeOutput = document.getElementById('codeOutput');
const cardContainer = document.getElementById('cardContainer');
const downloadBtn = document.getElementById('downloadBtn');
const saveCardBtn = document.getElementById('saveCardBtn');
const filename = document.getElementById('filename');
const themeLink = document.getElementById('theme-link');
const charCount = document.getElementById('charCount');
const lineCount = document.getElementById('lineCount');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const logoutBtn = document.getElementById('logoutBtn');

userEmailDisplay.textContent = localStorage.getItem('myBoardEmail');

function updateCode() {
    const code = codeInput.value;
    codeOutput.textContent = code;
    codeOutput.className = `language-${languageSelect.value}`;
    Prism.highlightElement(codeOutput);

    const extensions = {
        javascript: 'script.js',
        java: 'Main.java',
        html: 'index.html',
        css: 'style.css',
        python: 'main.py'
    };
    filename.textContent = extensions[languageSelect.value];
    charCount.textContent = code.length;
    lineCount.textContent = code.split('\n').length;
}

function changeTheme() {
    const theme = themeSelect.value;
    themeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/${theme}.min.css`;
}

downloadBtn.addEventListener('click', () => {
    html2canvas(cardContainer, { backgroundColor: null, scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'my-code-card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

saveCardBtn.addEventListener('click', async () => {
    const title = filename.textContent;
    const language = languageSelect.value;
    const code = codeInput.value;

    const res = await fetch(`http://127.0.0.1:5000/api/cards/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, language, code })
    });

    if (res.ok) {
        alert('Карточка сохранена в историю!');
    } else {
        alert('Ошибка при сохранении');
    }
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('myBoardUserId');
    localStorage.removeItem('myBoardEmail');
    window.location.href = 'auth.html';
});

codeInput.addEventListener('input', updateCode);
languageSelect.addEventListener('change', updateCode);
themeSelect.addEventListener('change', changeTheme);

updateCode();