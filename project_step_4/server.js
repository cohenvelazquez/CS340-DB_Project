// Banana Phone Estate Services - Node.js Express Server with Database Connectivity
// Authors: Cohen Velazquez and Joseph Lucciano Barberan
// Group: 80
// Date: August 7, 2025
// Citation: Database connection structure adapted from course examples and MySQL2 documentation

const express = require('express');
const path = require('path');
const cors = require('cors');

// Import database connection pool
const pool = require('./db-connector');

const app = express();
const PORT = 6144;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'client/public')));

// Basic route to serve index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

// RESET endpoint - calls the stored procedure to reset database
app.post('/api/reset', async (req, res) => {
    try {
        const query = 'CALL sp_reset_banana_phone_db()';
        const [results] = await pool.execute(query);
        
        console.log('Database reset successful');
        res.json({ 
            success: true, 
            message: 'Database has been reset successfully' 
        });
    } catch (error) {
        console.error('Database reset error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Database reset failed',
            error: error.message 
        });
    }
});

// READ operations - Get all events
app.get('/api/events', async (req, res) => {
    try {
        const query = 'SELECT eventID, title, startDate, endDate, location, description FROM EstateSaleEvents ORDER BY startDate DESC';
        const [results] = await pool.execute(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// READ operations - Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const query = 'SELECT customerID, firstName, lastName, email, phone, created_at FROM Customers ORDER BY lastName, firstName';
        const [results] = await pool.execute(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// READ operations - Get all items
app.get('/api/items', async (req, res) => {
    try {
        const query = `
            SELECT i.itemID, i.eventID, i.name, i.category, i.description, 
                   i.startingPrice, i.status, e.title as eventTitle
            FROM Items i
            JOIN EstateSaleEvents e ON i.eventID = e.eventID
            ORDER BY i.eventID, i.name
        `;
        const [results] = await pool.execute(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// READ operations - Get all sales
app.get('/api/sales', async (req, res) => {
    try {
        const query = `
            SELECT s.saleID, s.customerID, s.saleDate, s.totalAmount, s.paymentMethod,
                   CONCAT(c.firstName, ' ', c.lastName) as customerName
            FROM Sales s
            JOIN Customers c ON s.customerID = c.customerID
            ORDER BY s.saleDate DESC
        `;
        const [results] = await pool.execute(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Failed to fetch sales' });
    }
});

// READ operations - Get sold items (intersection table)
app.get('/api/solditems', async (req, res) => {
    try {
        const query = `
            SELECT si.saleID, si.itemID, si.unitPrice, si.quantity,
                   i.name as itemName, i.category,
                   CONCAT(c.firstName, ' ', c.lastName) as customerName,
                   s.saleDate
            FROM SoldItems si
            JOIN Items i ON si.itemID = i.itemID
            JOIN Sales s ON si.saleID = s.saleID
            JOIN Customers c ON s.customerID = c.customerID
            ORDER BY s.saleDate DESC
        `;
        const [results] = await pool.execute(query);
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Failed to fetch sold items' });
    }
});

// CUD operation for demonstration - Delete a customer
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const customerId = req.params.id;
        const query = 'CALL sp_delete_customer(?)';
        const [results] = await pool.execute(query, [customerId]);
        
        res.json({ 
            success: true, 
            message: 'Customer deleted successfully' 
        });
    } catch (error) {
        console.error('Database delete error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete customer',
            error: error.message 
        });
    }
});

// Catch all handler to serve static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Banana Phone Estate Services server running on port ${PORT}`);
    console.log(`Visit: http://classwork.engr.oregonstate.edu:${PORT}`);
    console.log('Database connection pool configured and ready');
});

module.exports = app;
