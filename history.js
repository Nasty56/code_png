const userId = localStorage.getItem('myBoardUserId');
if (!userId) window.location.href = 'auth.html';

const historyGrid = document.getElementById('historyGrid');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const logoutBtn = document.getElementById('logoutBtn');

userEmailDisplay.textContent = localStorage.getItem('myBoardEmail');

async function loadCards() {
    const res = await fetch(`http://127.0.0.1:5000/api/cards/${userId}`);
    if (res.ok) {
        const cards = await res.json();

        if (cards.length === 0) {
            historyGrid.innerHTML = '<p style="color:#888;">У вас пока нет сохраненных карточек.</p>';
            return;
        }

        cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'history-card';

            const titleEl = document.createElement('span');
            titleEl.className = 'filename';
            titleEl.textContent = card.title;

            const preEl = document.createElement('pre');
            preEl.textContent = card.code;

            cardEl.appendChild(titleEl);
            cardEl.appendChild(preEl);

            historyGrid.appendChild(cardEl);
        });
    }
}

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('myBoardUserId');
    localStorage.removeItem('myBoardEmail');
    window.location.href = 'auth.html';
});

loadCards();