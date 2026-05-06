// Node.js Backend Server for User Tracking
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database file (simple JSON file for demo - use real DB in production)
const DB_FILE = path.join(__dirname, 'users.json');

// Initialize database
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], serials: [] }));
}

// Read database
function readDB() {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
}

// Write database
function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// API Routes

// Track user activity
app.post('/api/track', (req, res) => {
    try {
        const { serial, device, os, browser } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        const db = readDB();
        
        // Check if serial is valid
        const serialExists = db.serials.find(s => s.key === serial);
        if (!serialExists) {
            return res.status(403).json({ error: 'Invalid serial key' });
        }
        
        // Find or create user entry
        let user = db.users.find(u => u.serial === serial && u.ip === ip);
        
        if (user) {
            // Update existing user
            user.lastSeen = new Date().toISOString();
            user.status = 'online';
            user.device = device;
            user.os = os;
            user.browser = browser;
        } else {
            // Create new user entry
            user = {
                id: Date.now().toString(),
                serial,
                ip,
                device,
                os,
                browser,
                firstSeen: new Date().toISOString(),
                lastSeen: new Date().toISOString(),
                status: 'online'
            };
            db.users.push(user);
        }
        
        writeDB(db);
        res.json({ success: true, message: 'Activity tracked' });
    } catch (error) {
        console.error('Error tracking user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all users
app.get('/api/users', (req, res) => {
    try {
        const db = readDB();
        
        // Mark users as offline if last seen > 5 minutes ago
        const now = new Date();
        db.users.forEach(user => {
            const lastSeen = new Date(user.lastSeen);
            const diff = (now - lastSeen) / 1000 / 60; // minutes
            if (diff > 5) {
                user.status = 'offline';
            }
        });
        
        writeDB(db);
        res.json(db.users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Generate new serial
app.post('/api/serial/generate', (req, res) => {
    try {
        const { prefix = 'WF' } = req.body;
        const db = readDB();
        
        // Generate unique serial
        let serial;
        do {
            serial = generateSerial(prefix);
        } while (db.serials.find(s => s.key === serial));
        
        // Add to database
        db.serials.push({
            key: serial,
            created: new Date().toISOString(),
            active: true
        });
        
        writeDB(db);
        res.json({ serial });
    } catch (error) {
        console.error('Error generating serial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Validate serial
app.post('/api/serial/validate', (req, res) => {
    try {
        const { serial } = req.body;
        const db = readDB();
        
        const serialData = db.serials.find(s => s.key === serial);
        
        if (serialData && serialData.active) {
            res.json({ valid: true });
        } else {
            res.json({ valid: false });
        }
    } catch (error) {
        console.error('Error validating serial:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get statistics
app.get('/api/stats', (req, res) => {
    try {
        const db = readDB();
        
        const stats = {
            totalUsers: db.users.length,
            activeUsers: db.users.filter(u => u.status === 'online').length,
            totalSerials: db.serials.length,
            uniqueIPs: new Set(db.users.map(u => u.ip)).size
        };
        
        res.json(stats);
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to generate serial
function generateSerial(prefix) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let serial = prefix;
    
    for (let i = 0; i < 4; i++) {
        serial += '-';
        for (let j = 0; j < 4; j++) {
            serial += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    
    return serial;
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`  POST /api/track - Track user activity`);
    console.log(`  GET  /api/users - Get all users`);
    console.log(`  POST /api/serial/generate - Generate new serial`);
    console.log(`  POST /api/serial/validate - Validate serial`);
    console.log(`  GET  /api/stats - Get statistics`);
});
