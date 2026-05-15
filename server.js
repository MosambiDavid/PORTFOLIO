const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Import Modules
const db = require('./db');
const messageModule = require('./messageModule');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('Admin connected to dashboard');
});

// API Endpoints

// Submit message
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide all fields' });
    }

    try {
        const newMessage = await messageModule.saveMessage(name, email, message);
        
        // Notify all connected admins via Socket.io
        io.emit('new-message', newMessage);
        
        res.status(200).json({ success: true, messageId: newMessage.id });
    } catch (err) {
        console.error('Save error:', err.message);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Fetch all messages for Admin dashboard
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await messageModule.getAllMessages();
        res.status(200).json(messages);
    } catch (err) {
        console.error('Fetch error:', err.message);
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

// Delete a message
app.delete('/api/messages/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const changes = await messageModule.deleteMessage(id);
        if (changes > 0) {
            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } catch (err) {
        console.error('Delete error:', err.message);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

// Serve the portfolio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve admin dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve resume
app.get('/resume', (req, res) => {
    res.sendFile(path.join(__dirname, 'resume.html'));
});

server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
