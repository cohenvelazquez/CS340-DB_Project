// Banana Phone Estate Services - Basic Express Server
// Authors: Cohen Velazquez and Joseph Lucciano Barberan
// Group: 80

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 9124;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client/public')));

// Basic route to serve React app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

// API routes placeholder (will be implemented in later steps)
app.get('/api/events', (req, res) => {
    res.json({ message: 'Events API endpoint - to be implemented' });
});

app.get('/api/items', (req, res) => {
    res.json({ message: 'Items API endpoint - to be implemented' });
});

app.get('/api/customers', (req, res) => {
    res.json({ message: 'Customers API endpoint - to be implemented' });
});

app.get('/api/sales', (req, res) => {
    res.json({ message: 'Sales API endpoint - to be implemented' });
});

// Catch all handler for React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Banana Phone Estate Services server running on port ${PORT}`);
    console.log(`Visit: http://classwork.engr.oregonstate.edu:${PORT}`);
});
