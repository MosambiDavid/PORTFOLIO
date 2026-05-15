-- SQLite schema for the portfolio database

-- Drop the table if it exists to start fresh (Optional)
-- DROP TABLE IF EXISTS messages;

-- Create the messages table
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime'))
);

-- Note: In SQLite, you don't need 'CREATE DATABASE' or 'USE'. 
-- The database is the file itself (database.sqlite).
