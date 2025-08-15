// Banana Phone Estate Services - Node.js Express Server with Complete CRUD Operations
// Authors: Cohen Velazquez and Joseph Lucciano Barberan
// Group: 80
// Date: August 14, 2025
// Citation: Database connection structure adapted from course examples and MySQL2 documentation

const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Import database connection pool
const pool = require('./db-connector');

const app = express();
const PORT = 6144;

// ====================================================================
// MIDDLEWARE CONFIGURATION
// ====================================================================

// Enable CORS for cross-origin requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Performance monitoring middleware to track slow requests
app.use((req, res, next) => {
    req.startTime = Date.now();
    
    // Set a timeout for all requests (30 seconds)
    const timeout = setTimeout(() => {
        if (!res.headersSent) {
            console.log(`Request timeout: ${req.method} ${req.path}`);
            res.status(408).json({ error: 'Request timeout' });
        }
    }, 30000);
    
    res.on('finish', () => {
        clearTimeout(timeout);
        const duration = Date.now() - req.startTime;
        if (duration > 1000) { // Log requests taking more than 1 second
            console.log(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
        }
    });
    
    next();
});

// Database connection error handling
pool.on('connection', (connection) => {
    console.log('New connection established');
});

pool.on('error', (err) => {
    console.error('Database pool error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection lost, will reconnect...');
    }
});

// Serve static files with caching headers for better performance
app.use(express.static(path.join(__dirname, 'client/public'), {
    maxAge: '1h', // Cache static files for 1 hour
    etag: true
}));

// ====================================================================
// BASIC ROUTES
// ====================================================================

// Serve the main index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

// Debug endpoint to check database connectivity and table counts
app.get('/api/debug/tables', async (req, res) => {
    try {
        const [itemsCount] = await pool.execute('SELECT COUNT(*) as count FROM Items');
        const [eventsCount] = await pool.execute('SELECT COUNT(*) as count FROM EstateSaleEvents');
        const [customersCount] = await pool.execute('SELECT COUNT(*) as count FROM Customers');
        const [salesCount] = await pool.execute('SELECT COUNT(*) as count FROM Sales');
        const [soldItemsCount] = await pool.execute('SELECT COUNT(*) as count FROM SoldItems');
        
        res.json({
            items: itemsCount[0].count,
            events: eventsCount[0].count,
            customers: customersCount[0].count,
            sales: salesCount[0].count,
            soldItems: soldItemsCount[0].count
        });
    } catch (error) {
        console.error('Database debug error:', error);
        res.status(500).json({ 
            error: 'Database connection failed', 
            details: error.message 
        });
    }
});

// ====================================================================
// DATABASE RESET FUNCTIONALITY
// ====================================================================

// Reset database endpoint - calls the stored procedure to reset database
// Prevent concurrent resets by using a simple lock
let resetInProgress = false;

app.post('/api/reset', async (req, res) => {
    // Check if reset is already in progress
    if (resetInProgress) {
        return res.status(429).json({ 
            success: false, 
            message: 'Database reset already in progress. Please wait.' 
        });
    }

    console.log('Attempting to reset database...');
    resetInProgress = true;
    let responseSet = false;
    const startTime = Date.now();
    let connection = null;
    
    try {
        // Get a dedicated connection for the reset operation with extended timeout
        connection = await pool.getConnection();
        
        // Set connection-specific timeouts for the reset operation
        await connection.execute('SET SESSION wait_timeout = 60');
        await connection.execute('SET SESSION interactive_timeout = 60');
        await connection.execute('SET SESSION net_read_timeout = 60');
        await connection.execute('SET SESSION net_write_timeout = 60');
        await connection.execute('SET SESSION lock_wait_timeout = 30');
        
        // Set up timeout with better error handling
        const resetPromise = connection.execute('CALL sp_reset_banana_phone_db()');
        
        const timeoutPromise = new Promise((_, reject) => {
            const timeoutId = setTimeout(() => {
                console.warn('Reset operation timeout reached, canceling...');
                reject(new Error('Reset operation timeout after 30 seconds'));
            }, 30000);
            return timeoutId;
        });
        
        await Promise.race([resetPromise, timeoutPromise]);
        
        const duration = Date.now() - startTime;
        console.log(`Database reset completed successfully using stored procedure (${duration}ms)`);
        
        if (!responseSet && !res.headersSent) {
            responseSet = true;
            res.json({ 
                success: true, 
                message: 'Database has been reset successfully',
                duration: `${duration}ms`
            });
        }
        
    } catch (error) {
        console.error('Database reset failed:', error.message);
        const duration = Date.now() - startTime;
        
        // Check if it was a timeout
        if (error.message.includes('timeout')) {
            console.warn(`Reset timeout: operation took ${duration}ms - this may indicate database load or lock contention`);
        }
        
        if (!responseSet && !res.headersSent) {
            responseSet = true;
            // Set appropriate timeout status
            const statusCode = error.message.includes('timeout') ? 408 : 500;
            res.status(statusCode).json({ 
                success: false, 
                message: error.message.includes('timeout') ? 
                    'Database reset timed out. The database may be under heavy load. Please try again.' :
                    'Database reset failed. Please try again.',
                error: error.message,
                duration: `${duration}ms`
            });
        }
    } finally {
        // Always release the dedicated connection
        if (connection) {
            try {
                connection.release();
            } catch (releaseError) {
                console.warn('Error releasing connection:', releaseError.message);
            }
        }
        
        // Always release the lock
        resetInProgress = false;
        const duration = Date.now() - startTime;
        if (duration > 10000) { // Log slow requests over 10 seconds
            console.warn(`Slow reset operation took ${duration}ms`);
        }
    }
});

// ====================================================================
// ESTATE SALE EVENTS - CRUD OPERATIONS
// ====================================================================

// READ - Get all events
app.get('/api/events', async (req, res) => {
    try {
        const query = `
            SELECT eventID, title, startDate, endDate, location, description 
            FROM EstateSaleEvents 
            ORDER BY startDate DESC
        `;
        const [results] = await pool.execute(query);
        console.log(`Events query: Found ${results.length} events`);
        res.json(results);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// READ - Get single event by ID
app.get('/api/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const query = 'SELECT * FROM EstateSaleEvents WHERE eventID = ?';
        const [results] = await pool.execute(query, [eventId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});

// CREATE - Add new event
app.post('/api/events', async (req, res) => {
    try {
        const { title, startDate, endDate, location, description } = req.body;
        
        // Validate required fields
        if (!title || !startDate || !endDate || !location) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: title, startDate, endDate, location' 
            });
        }
        
        const query = `
            INSERT INTO EstateSaleEvents (title, startDate, endDate, location, description) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const [results] = await pool.execute(query, [title, startDate, endDate, location, description]);
        
        console.log(`Event created with ID: ${results.insertId}`);
        res.json({ 
            success: true, 
            eventID: results.insertId,
            message: 'Event created successfully' 
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create event',
            error: error.message 
        });
    }
});

// UPDATE - Edit event
app.put('/api/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const { title, startDate, endDate, location, description } = req.body;
        
        const query = `
            UPDATE EstateSaleEvents 
            SET title = ?, startDate = ?, endDate = ?, location = ?, description = ?
            WHERE eventID = ?
        `;
        
        const [results] = await pool.execute(query, [title, startDate, endDate, location, description, eventId]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Event not found' 
            });
        }
        
        console.log(`Event ${eventId} updated successfully`);
        res.json({ 
            success: true, 
            message: 'Event updated successfully' 
        });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update event',
            error: error.message 
        });
    }
});

// DELETE - Remove event (and associated items due to CASCADE)
app.delete('/api/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        
        // Check if event exists and get associated items count
        const checkQuery = `
            SELECT e.title, COUNT(i.itemID) as itemCount 
            FROM EstateSaleEvents e 
            LEFT JOIN Items i ON e.eventID = i.eventID 
            WHERE e.eventID = ? 
            GROUP BY e.eventID
        `;
        const [checkResults] = await pool.execute(checkQuery, [eventId]);
        
        if (checkResults.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Event not found' 
            });
        }
        
        const itemCount = checkResults[0].itemCount;
        const eventTitle = checkResults[0].title;
        
        // Warn if event has items (they will be deleted due to CASCADE)
        if (itemCount > 0) {
            console.log(`Warning: Deleting event "${eventTitle}" will also delete ${itemCount} associated items`);
        }
        
        // Delete the event using stored procedure
        await pool.execute('CALL sp_delete_estate_sale_event(?)', [eventId]);
        
        console.log(`Event "${eventTitle}" deleted successfully using stored procedure`);
        res.json({ 
            success: true, 
            message: `Event deleted successfully${itemCount > 0 ? ` (${itemCount} associated items also removed)` : ''}` 
        });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete event',
            error: error.message 
        });
    }
});

// ====================================================================
// CUSTOMERS - CRUD OPERATIONS
// ====================================================================

// READ - Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const query = `
            SELECT customerID, firstName, lastName, email, phone, created_at 
            FROM Customers 
            ORDER BY lastName, firstName
        `;
        const [results] = await pool.execute(query);
        console.log(`Customers query: Found ${results.length} customers`);
        res.json(results);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// READ - Get single customer by ID
app.get('/api/customers/:id', async (req, res) => {
    try {
        const customerId = req.params.id;
        const query = 'SELECT * FROM Customers WHERE customerID = ?';
        const [results] = await pool.execute(query, [customerId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching customer:', error);
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
});

// CREATE - Add new customer
app.post('/api/customers', async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: firstName, lastName, email' 
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }
        
        const query = `
            INSERT INTO Customers (firstName, lastName, email, phone) 
            VALUES (?, ?, ?, ?)
        `;
        
        const [results] = await pool.execute(query, [firstName, lastName, email, phone]);
        
        console.log(`Customer created with ID: ${results.insertId}`);
        res.json({ 
            success: true, 
            customerID: results.insertId,
            message: 'Customer created successfully' 
        });
    } catch (error) {
        console.error('Error creating customer:', error);
        
        // Handle duplicate email error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                success: false, 
                message: 'Email address already exists' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create customer',
            error: error.message 
        });
    }
});

// UPDATE - Edit customer
app.put('/api/customers/:id', async (req, res) => {
    try {
        const customerId = req.params.id;
        const { firstName, lastName, email, phone } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: firstName, lastName, email' 
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }
        
        const query = `
            UPDATE Customers 
            SET firstName = ?, lastName = ?, email = ?, phone = ?
            WHERE customerID = ?
        `;
        
        const [results] = await pool.execute(query, [firstName, lastName, email, phone, customerId]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Customer not found' 
            });
        }
        
        console.log(`Customer ${customerId} updated successfully`);
        res.json({ 
            success: true, 
            message: 'Customer updated successfully' 
        });
    } catch (error) {
        console.error('Error updating customer:', error);
        
        // Handle duplicate email error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                success: false, 
                message: 'Email address already exists' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update customer',
            error: error.message 
        });
    }
});

// DELETE - Remove customer (with safety checks)
app.delete('/api/customers/:id', async (req, res) => {
    try {
        const customerId = req.params.id;
        
        // Check if customer exists and has any sales
        const checkQuery = `
            SELECT c.firstName, c.lastName, COUNT(s.saleID) as saleCount 
            FROM Customers c 
            LEFT JOIN Sales s ON c.customerID = s.customerID 
            WHERE c.customerID = ? 
            GROUP BY c.customerID
        `;
        const [checkResults] = await pool.execute(checkQuery, [customerId]);
        
        if (checkResults.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Customer not found' 
            });
        }
        
        const saleCount = checkResults[0].saleCount;
        const customerName = `${checkResults[0].firstName} ${checkResults[0].lastName}`;
        
        // Warn if customer has sales (they will be deleted due to CASCADE)
        if (saleCount > 0) {
            console.log(`Warning: Deleting customer "${customerName}" will also delete ${saleCount} associated sales`);
        }
        
        // Delete the customer using stored procedure
        await pool.execute('CALL sp_delete_customer(?)', [customerId]);
        
        console.log(`Customer "${customerName}" deleted successfully using stored procedure`);
        res.json({ 
            success: true, 
            message: `Customer deleted successfully${saleCount > 0 ? ` (${saleCount} associated sales also removed)` : ''}` 
        });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete customer',
            error: error.message 
        });
    }
});

// ====================================================================
// ITEMS - CRUD OPERATIONS
// ====================================================================

// READ - Get all items with event information
app.get('/api/items', async (req, res) => {
    try {
        const query = `
            SELECT i.itemID, i.eventID, i.name, i.category, i.description, 
                   i.startingPrice, i.status, 
                   COALESCE(e.title, 'No Event Assigned') as eventTitle
            FROM Items i
            LEFT JOIN EstateSaleEvents e ON i.eventID = e.eventID
            ORDER BY i.eventID, i.name
        `;
        const [results] = await pool.execute(query);
        console.log(`Items query: Found ${results.length} items`);
        res.json(results);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// READ - Get single item by ID with event information
app.get('/api/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const query = `
            SELECT i.*, e.title as eventTitle 
            FROM Items i 
            LEFT JOIN EstateSaleEvents e ON i.eventID = e.eventID 
            WHERE i.itemID = ?
        `;
        const [results] = await pool.execute(query, [itemId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

// CREATE - Add new item
app.post('/api/items', async (req, res) => {
    try {
        const { eventID, name, category, description, startingPrice, status } = req.body;
        
        // Validate required fields
        if (!eventID || !name || !startingPrice) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: eventID, name, startingPrice' 
            });
        }
        
        // Validate starting price is positive
        if (parseFloat(startingPrice) < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Starting price must be positive' 
            });
        }
        
        // Validate event exists
        const eventCheckQuery = 'SELECT eventID FROM EstateSaleEvents WHERE eventID = ?';
        const [eventCheck] = await pool.execute(eventCheckQuery, [eventID]);
        
        if (eventCheck.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Event not found' 
            });
        }
        
        // Set default status if not provided
        const itemStatus = status || 'Available';
        
        const query = `
            INSERT INTO Items (eventID, name, category, description, startingPrice, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const [results] = await pool.execute(query, [eventID, name, category, description, startingPrice, itemStatus]);
        
        console.log(`Item created with ID: ${results.insertId}`);
        res.json({ 
            success: true, 
            itemID: results.insertId,
            message: 'Item created successfully' 
        });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create item',
            error: error.message 
        });
    }
});

// UPDATE - Edit item
app.put('/api/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const { name, description, category, startingPrice, eventID, status } = req.body;
        
        // Validate required fields
        if (!name || !startingPrice || !eventID) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: name, startingPrice, eventID' 
            });
        }
        
        // Validate starting price is positive
        if (parseFloat(startingPrice) < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Starting price must be positive' 
            });
        }
        
        // Validate event exists
        const eventCheckQuery = 'SELECT eventID FROM EstateSaleEvents WHERE eventID = ?';
        const [eventCheck] = await pool.execute(eventCheckQuery, [eventID]);
        
        if (eventCheck.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Event not found' 
            });
        }
        
        const query = `
            UPDATE Items 
            SET name = ?, description = ?, category = ?, startingPrice = ?, eventID = ?, status = ?
            WHERE itemID = ?
        `;
        
        const [results] = await pool.execute(query, [name, description, category, startingPrice, eventID, status, itemId]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found' 
            });
        }
        
        console.log(`Item ${itemId} updated successfully`);
        res.json({ 
            success: true, 
            message: 'Item updated successfully' 
        });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update item',
            error: error.message 
        });
    }
});

// DELETE - Remove item (with safety checks for sold items)
app.delete('/api/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        console.log(`DELETE request received for item ID: ${itemId}`);
        
        // Check if item exists and get its details
        const checkQuery = `
            SELECT i.name, i.status, COUNT(si.itemID) as soldCount 
            FROM Items i 
            LEFT JOIN SoldItems si ON i.itemID = si.itemID 
            WHERE i.itemID = ? 
            GROUP BY i.itemID
        `;
        const [checkResults] = await pool.execute(checkQuery, [itemId]);
        
        if (checkResults.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found' 
            });
        }
        
        const soldCount = checkResults[0].soldCount;
        const itemName = checkResults[0].name;
        
        // Prevent deletion if item has been sold
        if (soldCount > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot delete item that has been sold. Please remove from sales first.' 
            });
        }
        
        // Delete the item using stored procedure
        await pool.execute('CALL sp_delete_item(?)', [itemId]);
        
        console.log(`Item "${itemName}" deleted successfully using stored procedure`);
        res.json({ 
            success: true, 
            message: 'Item deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete item',
            error: error.message 
        });
    }
});

// ====================================================================
// SALES - CRUD OPERATIONS
// ====================================================================

// READ - Get all sales with customer information
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
        console.log(`Sales query: Found ${results.length} sales`);
        res.json(results);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ error: 'Failed to fetch sales' });
    }
});

// READ - Get single sale by ID with customer information
app.get('/api/sales/:id', async (req, res) => {
    try {
        const saleId = req.params.id;
        const query = `
            SELECT s.*, c.firstName, c.lastName 
            FROM Sales s 
            JOIN Customers c ON s.customerID = c.customerID 
            WHERE s.saleID = ?
        `;
        const [results] = await pool.execute(query, [saleId]);
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Sale not found' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching sale:', error);
        res.status(500).json({ error: 'Failed to fetch sale' });
    }
});

// CREATE - Add new sale
app.post('/api/sales', async (req, res) => {
    try {
        const { customerID, saleDate, totalAmount, paymentMethod } = req.body;
        
        // Validate required fields
        if (!customerID || !saleDate || !totalAmount || !paymentMethod) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: customerID, saleDate, totalAmount, paymentMethod' 
            });
        }
        
        // Validate total amount is positive
        if (parseFloat(totalAmount) < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Total amount must be positive' 
            });
        }
        
        // Validate customer exists
        const customerCheckQuery = 'SELECT customerID FROM Customers WHERE customerID = ?';
        const [customerCheck] = await pool.execute(customerCheckQuery, [customerID]);
        
        if (customerCheck.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Customer not found' 
            });
        }
        
        // Validate payment method
        const validPaymentMethods = ['Cash', 'Credit Card', 'Check'];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid payment method. Must be: Cash, Credit Card, or Check' 
            });
        }
        
        const query = `
            INSERT INTO Sales (customerID, saleDate, totalAmount, paymentMethod) 
            VALUES (?, ?, ?, ?)
        `;
        
        const [results] = await pool.execute(query, [customerID, saleDate, totalAmount, paymentMethod]);
        
        console.log(`Sale created with ID: ${results.insertId}`);
        res.json({ 
            success: true, 
            saleID: results.insertId,
            message: 'Sale created successfully' 
        });
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create sale',
            error: error.message 
        });
    }
});

// UPDATE - Edit sale
app.put('/api/sales/:id', async (req, res) => {
    try {
        const saleId = req.params.id;
        const { customerID, saleDate, totalAmount, paymentMethod } = req.body;
        
        // Validate required fields
        if (!customerID || !saleDate || !totalAmount || !paymentMethod) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: customerID, saleDate, totalAmount, paymentMethod' 
            });
        }
        
        // Validate total amount is positive
        if (parseFloat(totalAmount) < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Total amount must be positive' 
            });
        }
        
        // Validate customer exists
        const customerCheckQuery = 'SELECT customerID FROM Customers WHERE customerID = ?';
        const [customerCheck] = await pool.execute(customerCheckQuery, [customerID]);
        
        if (customerCheck.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Customer not found' 
            });
        }
        
        // Validate payment method
        const validPaymentMethods = ['Cash', 'Credit Card', 'Check'];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid payment method. Must be: Cash, Credit Card, or Check' 
            });
        }
        
        const query = `
            UPDATE Sales 
            SET customerID = ?, saleDate = ?, totalAmount = ?, paymentMethod = ?
            WHERE saleID = ?
        `;
        
        const [results] = await pool.execute(query, [customerID, saleDate, totalAmount, paymentMethod, saleId]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Sale not found' 
            });
        }
        
        console.log(`Sale ${saleId} updated successfully`);
        res.json({ 
            success: true, 
            message: 'Sale updated successfully' 
        });
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update sale',
            error: error.message 
        });
    }
});

// DELETE - Remove sale (with safety checks for sold items)
app.delete('/api/sales/:id', async (req, res) => {
    try {
        const saleId = req.params.id;
        
        // Check if sale exists and get associated sold items count
        const checkQuery = `
            SELECT s.totalAmount, s.saleDate, COUNT(si.itemID) as itemCount,
                   CONCAT(c.firstName, ' ', c.lastName) as customerName
            FROM Sales s 
            JOIN Customers c ON s.customerID = c.customerID
            LEFT JOIN SoldItems si ON s.saleID = si.saleID 
            WHERE s.saleID = ? 
            GROUP BY s.saleID
        `;
        const [checkResults] = await pool.execute(checkQuery, [saleId]);
        
        if (checkResults.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Sale not found' 
            });
        }
        
        const itemCount = checkResults[0].itemCount;
        const customerName = checkResults[0].customerName;
        const saleDate = checkResults[0].saleDate;
        
        // Before deleting, log the action for sold items
        if (itemCount > 0) {
            console.log(`Sale deletion will update ${itemCount} sold items back to Available status`);
        }
        
        // Delete the sale using stored procedure (which handles item status updates)
        await pool.execute('CALL sp_delete_sale(?)', [saleId]);
        
        console.log(`Sale for customer "${customerName}" on ${saleDate} deleted successfully using stored procedure`);
        res.json({ 
            success: true, 
            message: `Sale deleted successfully${itemCount > 0 ? ` (${itemCount} items returned to Available status)` : ''}` 
        });
    } catch (error) {
        console.error('Error deleting sale:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete sale',
            error: error.message 
        });
    }
});

// ====================================================================
// SOLD ITEMS (INTERSECTION TABLE) - CRUD OPERATIONS
// ====================================================================

// READ - Get all sold items with related information
app.get('/api/solditems', async (req, res) => {
    try {
        const query = `
            SELECT si.saleID, si.itemID, si.unitPrice, si.quantity,
                   i.name as itemName, i.category, i.startingPrice,
                   CONCAT(c.firstName, ' ', c.lastName) as customerName,
                   s.saleDate, s.paymentMethod, e.title as eventTitle
            FROM SoldItems si
            JOIN Items i ON si.itemID = i.itemID
            JOIN Sales s ON si.saleID = s.saleID
            JOIN Customers c ON s.customerID = c.customerID
            LEFT JOIN EstateSaleEvents e ON i.eventID = e.eventID
            ORDER BY s.saleDate DESC, i.name
        `;
        const [results] = await pool.execute(query);
        console.log(`Sold items query: Found ${results.length} sold items`);
        res.json(results);
    } catch (error) {
        console.error('Error fetching sold items:', error);
        res.status(500).json({ error: 'Failed to fetch sold items' });
    }
});

// READ - Get sold items for a specific sale
app.get('/api/sales/:saleId/items', async (req, res) => {
    try {
        const saleId = req.params.saleId;
        const query = `
            SELECT si.saleID, si.itemID, si.unitPrice, si.quantity,
                   i.name as itemName, i.category, i.description
            FROM SoldItems si
            JOIN Items i ON si.itemID = i.itemID
            WHERE si.saleID = ?
            ORDER BY i.name
        `;
        const [results] = await pool.execute(query, [saleId]);
        res.json(results);
    } catch (error) {
        console.error('Error fetching sold items for sale:', error);
        res.status(500).json({ error: 'Failed to fetch sold items for sale' });
    }
});

// CREATE - Add item to sale (create sold item record)
app.post('/api/solditems', async (req, res) => {
    try {
        const { saleID, itemID, unitPrice, quantity } = req.body;
        
        // Validate required fields
        if (!saleID || !itemID || !unitPrice || !quantity) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: saleID, itemID, unitPrice, quantity' 
            });
        }
        
        // Validate positive values
        if (parseFloat(unitPrice) < 0 || parseInt(quantity) < 1) {
            return res.status(400).json({ 
                success: false, 
                message: 'Unit price must be positive and quantity must be at least 1' 
            });
        }
        
        // Check if sale exists
        const saleCheckQuery = 'SELECT saleID FROM Sales WHERE saleID = ?';
        const [saleCheck] = await pool.execute(saleCheckQuery, [saleID]);
        
        if (saleCheck.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Sale not found' 
            });
        }
        
        // Check if item exists and is available
        const itemCheckQuery = 'SELECT itemID, status, name FROM Items WHERE itemID = ?';
        const [itemCheck] = await pool.execute(itemCheckQuery, [itemID]);
        
        if (itemCheck.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Item not found' 
            });
        }
        
        if (itemCheck[0].status === 'Sold') {
            return res.status(400).json({ 
                success: false, 
                message: 'Item is already sold' 
            });
        }
        
        // Check if this item is already in this sale
        const duplicateCheckQuery = 'SELECT * FROM SoldItems WHERE saleID = ? AND itemID = ?';
        const [duplicateCheck] = await pool.execute(duplicateCheckQuery, [saleID, itemID]);
        
        if (duplicateCheck.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Item is already in this sale' 
            });
        }
        
        // Begin transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Insert into SoldItems
            const insertQuery = `
                INSERT INTO SoldItems (saleID, itemID, unitPrice, quantity) 
                VALUES (?, ?, ?, ?)
            `;
            await connection.execute(insertQuery, [saleID, itemID, unitPrice, quantity]);
            
            // Update item status to Sold
            const updateItemQuery = 'UPDATE Items SET status = "Sold" WHERE itemID = ?';
            await connection.execute(updateItemQuery, [itemID]);
            
            // Update sale total amount
            const updateSaleQuery = `
                UPDATE Sales 
                SET totalAmount = (
                    SELECT SUM(si.unitPrice * si.quantity) 
                    FROM SoldItems si 
                    WHERE si.saleID = ?
                )
                WHERE saleID = ?
            `;
            await connection.execute(updateSaleQuery, [saleID, saleID]);
            
            await connection.commit();
            connection.release();
            
            console.log(`Item ${itemID} added to sale ${saleID}`);
            res.json({ 
                success: true, 
                message: 'Item added to sale successfully' 
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Error adding item to sale:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to add item to sale',
            error: error.message 
        });
    }
});

// UPDATE - Modify sold item (unit price or quantity)
app.put('/api/solditems/:saleId/:itemId', async (req, res) => {
    try {
        const { saleId, itemId } = req.params;
        const { unitPrice, quantity } = req.body;
        
        // Validate required fields
        if (!unitPrice || !quantity) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: unitPrice, quantity' 
            });
        }
        
        // Validate positive values
        if (parseFloat(unitPrice) < 0 || parseInt(quantity) < 1) {
            return res.status(400).json({ 
                success: false, 
                message: 'Unit price must be positive and quantity must be at least 1' 
            });
        }
        
        // Begin transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Update sold item
            const updateQuery = `
                UPDATE SoldItems 
                SET unitPrice = ?, quantity = ?
                WHERE saleID = ? AND itemID = ?
            `;
            const [results] = await connection.execute(updateQuery, [unitPrice, quantity, saleId, itemId]);
            
            if (results.affectedRows === 0) {
                await connection.rollback();
                connection.release();
                return res.status(404).json({ 
                    success: false, 
                    message: 'Sold item record not found' 
                });
            }
            
            // Update sale total amount
            const updateSaleQuery = `
                UPDATE Sales 
                SET totalAmount = (
                    SELECT SUM(si.unitPrice * si.quantity) 
                    FROM SoldItems si 
                    WHERE si.saleID = ?
                )
                WHERE saleID = ?
            `;
            await connection.execute(updateSaleQuery, [saleId, saleId]);
            
            await connection.commit();
            connection.release();
            
            console.log(`Sold item record updated for sale ${saleId}, item ${itemId}`);
            res.json({ 
                success: true, 
                message: 'Sold item updated successfully' 
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Error updating sold item:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update sold item',
            error: error.message 
        });
    }
});

// DELETE - Remove item from sale
app.delete('/api/solditems/:saleId/:itemId', async (req, res) => {
    try {
        const { saleId, itemId } = req.params;
        
        // Check if sold item record exists
        const checkQuery = 'SELECT * FROM SoldItems WHERE saleID = ? AND itemID = ?';
        const [checkResults] = await pool.execute(checkQuery, [saleId, itemId]);
        
        if (checkResults.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Sold item record not found' 
            });
        }
        
        // Delete the sold item using stored procedure
        await pool.execute('CALL sp_delete_sold_item(?, ?)', [saleId, itemId]);
        
        console.log(`Item ${itemId} removed from sale ${saleId} using stored procedure`);
        res.json({ 
            success: true, 
            message: 'Item removed from sale successfully' 
        });
    } catch (error) {
        console.error('Error removing item from sale:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to remove item from sale',
            error: error.message 
        });
    }
});

// ====================================================================
// HELPER ENDPOINTS FOR FRONTEND DROPDOWNS
// ====================================================================

// Get all events for dropdown selections
app.get('/api/events/dropdown', async (req, res) => {
    try {
        const query = 'SELECT eventID, title FROM EstateSaleEvents ORDER BY title';
        const [results] = await pool.execute(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching events for dropdown:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Get all customers for dropdown selections
app.get('/api/customers/dropdown', async (req, res) => {
    try {
        const query = `
            SELECT customerID, CONCAT(firstName, ' ', lastName) as fullName 
            FROM Customers 
            ORDER BY lastName, firstName
        `;
        const [results] = await pool.execute(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching customers for dropdown:', error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// Get available items for sale (not already sold)
app.get('/api/items/available', async (req, res) => {
    try {
        const query = `
            SELECT i.itemID, i.name, i.startingPrice, e.title as eventTitle
            FROM Items i
            LEFT JOIN EstateSaleEvents e ON i.eventID = e.eventID
            WHERE i.status = 'Available'
            ORDER BY i.name
        `;
        const [results] = await pool.execute(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching available items:', error);
        res.status(500).json({ error: 'Failed to fetch available items' });
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

// ====================================================================
// SERVER INITIALIZATION AND STORED PROCEDURE SETUP
// ====================================================================

// Function to automatically load stored procedures on server startup
async function initializeStoredProcedures() {
    try {
        console.log('Loading stored procedures...');
        const fs = require('fs').promises;
        const plSqlContent = await fs.readFile(path.join(__dirname, 'PL.sql'), 'utf8');
        
        // Split the content by DELIMITER statements to get individual procedures
        const blocks = plSqlContent.split(/DELIMITER\s*[;\/]+/i);
        
        const connection = await pool.getConnection();
        
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i].trim();
            if (block && (block.includes('DROP PROCEDURE') || block.includes('CREATE PROCEDURE'))) {
                try {
                    // Clean up the block and execute
                    const cleanBlock = block.replace(/\/\/\s*$/gm, ';').trim();
                    if (cleanBlock) {
                        await connection.execute(cleanBlock);
                        console.log('Loaded procedure block successfully');
                    }
                } catch (error) {
                    if (!error.message.includes('already exists') && !error.message.includes("doesn't exist")) {
                        console.warn('Warning loading procedure:', error.message.substring(0, 100));
                    }
                }
            }
        }
        
        connection.release();
        console.log('Stored procedures loading completed');
        
    } catch (error) {
        console.error('Error loading stored procedures:', error.message);
        console.log('Server will continue without stored procedures - delete operations may not work properly');
    }
}

app.listen(PORT, async () => {
    console.log(`Banana Phone Estate Services server running on port ${PORT}`);
    console.log(`Visit: http://classwork.engr.oregonstate.edu:${PORT}`);
    console.log('Database connection pool configured and ready');
    
    // Automatically load stored procedures
    await initializeStoredProcedures();
});

module.exports = app;
