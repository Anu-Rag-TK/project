from flask import Flask, request
import sqlite3
from datetime import datetime

app = Flask(__name__)

def init_db():
    conn = sqlite3.connect("logs.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS visitors
                 (time TEXT, ip TEXT)''')
    conn.commit()
    conn.close()

@app.route('/')
def home():
    return "Backend running"

@app.route('/log')
def log():
    ip = request.remote_addr

    conn = sqlite3.connect("logs.db")
    c = conn.cursor()
    c.execute("INSERT INTO visitors VALUES (?, ?)", (
        str(datetime.now()), ip
    ))
    conn.commit()
    conn.close()

    return "logged"

init_db()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)