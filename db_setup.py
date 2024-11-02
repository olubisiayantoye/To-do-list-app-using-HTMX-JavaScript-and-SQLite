import sqlite3

# Connect to SQLite database
conn = sqlite3.connect('todo.db')
cursor = conn.cursor()

# Create todos table
cursor.execute('''
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    done BOOLEAN NOT NULL CHECK (done IN (0, 1))
)
''')

conn.commit()
conn.close()
