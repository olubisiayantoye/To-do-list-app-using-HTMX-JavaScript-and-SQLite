import sqlite3

# Connect to SQLite database
conn = sqlite3.connect('todo.db')
cursor = conn.cursor()

# Create todos table with additional columns
cursor.execute('''
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    due_date TEXT,
    priority TEXT,
    category TEXT,
    done BOOLEAN NOT NULL CHECK (done IN (0, 1)),
    progress INTEGER DEFAULT 0
)
''')

# Create subtasks table for checklists
cursor.execute('''
CREATE TABLE IF NOT EXISTS subtasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    todo_id INTEGER,
    subtask TEXT NOT NULL,
    done BOOLEAN NOT NULL CHECK (done IN (0, 1)),
    FOREIGN KEY (todo_id) REFERENCES todos (id) ON DELETE CASCADE
)
''')

conn.commit()
conn.close()

