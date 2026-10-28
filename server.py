from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS cards
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, title TEXT, language TEXT, code TEXT)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    try:
        c.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
        conn.commit()
        return jsonify({"message": "Успешно"}), 200
    except sqlite3.IntegrityError:
        return jsonify({"error": "Пользователь уже существует"}), 400
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT id, email FROM users WHERE email=? AND password=?", (email, password))
    user = c.fetchone()
    conn.close()

    if user:
        return jsonify({"userId": user[0], "email": user[1]}), 200
    else:
        return jsonify({"error": "Неверный email или пароль"}), 400

@app.route('/api/cards/<int:user_id>', methods=['GET'])
def get_cards(user_id):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT id, title, language, code FROM cards WHERE user_id=?", (user_id,))
    rows = c.fetchall()
    conn.close()

    cards = []
    for row in rows:
        cards.append({
            "id": row[0],
            "title": row[1],
            "language": row[2],
            "code": row[3]
        })
    return jsonify(cards)

@app.route('/api/cards/<int:user_id>', methods=['POST'])
def save_card(user_id):
    data = request.json
    title = data.get('title')
    language = data.get('language')
    code = data.get('code')

    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("INSERT INTO cards (user_id, title, language, code) VALUES (?, ?, ?, ?)",
              (user_id, title, language, code))
    conn.commit()
    conn.close()

    return jsonify({"message": "Карточка сохранена"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)