// server.js
// A complete Express.js application running on Bun

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup - works identically to Node.js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/static', express.static(path.join(__dirname, 'public')));

// Route definitions
app.get('/', (req, res) => {
    res.json({        message: 'Hello from Express on Bun!',
        runtime: typeof Bun !== 'undefined' ? 'Bun' : 'Node.js',
        nodeVersion: process.version
    });
});

// Route with parameters
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    res.json({ userId: id, timestamp: Date.now() });
});

// POST endpoint
app.post('/data', (req, res) => {
    const { body } = req;
    console.log('Received data:', body);
    res.status(201).json({ received: true, data: body });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Runtime: ${typeof Bun !== 'undefined' ? 'Bun' : 'Node.js'}`);
});
