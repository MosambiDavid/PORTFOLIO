const db = require('./db');

const messageModule = {
    /**
     * Save a new message to the database
     */
    saveMessage: (name, email, message) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO messages (name, email, message) VALUES (?, ?, ?)`;
            db.run(query, [name, email, message], function(err) {
                if (err) return reject(err);
                resolve({ 
                    id: this.lastID, 
                    name, 
                    email, 
                    message, 
                    created_at: new Date() 
                });
            });
        });
    },

    /**
     * Get all messages from the database
     */
    getAllMessages: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM messages ORDER BY created_at DESC", [], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    },

    /**
     * Delete a message by ID
     */
    deleteMessage: (id) => {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM messages WHERE id = ?`;
            db.run(query, [id], function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            });
        });
    }
};

module.exports = messageModule;
