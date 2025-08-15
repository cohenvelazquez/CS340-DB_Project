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

// Performance monitoring middleware
app.use((req, res, next) => {
    req.startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - req.startTime;
        if (duration > 1000) { // Log slow requests (>1 second)
            console.log(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
        }
    });
    next();
});

// Static file serving with caching
app.use(express.static(path.join(__dirname, 'client/public'), {
    maxAge: '1h', // Cache static files for 1 hour
    etag: true
}));

// Basic route to serve index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

// Debug endpoint to check database status
app.get('/api/debug/tables', async (req, res) => {
    try {
        const itemsCount = await pool.execute('SELECT COUNT(*) as count FROM Items');
        const eventsCount = await pool.execute('SELECT COUNT(*) as count FROM EstateSaleEvents');
        const customersCount = await pool.execute('SELECT COUNT(*) as count FROM Customers');
        const salesCount = await pool.execute('SELECT COUNT(*) as count FROM Sales');
        
        res.json({
            items: itemsCount[0][0].count,
            events: eventsCount[0][0].count,
            customers: customersCount[0][0].count,
            sales: salesCount[0][0].count
        });
    } catch (error) {
        console.error('Database debug error:', error);
        res.status(500).json({ error: 'Database connection failed', details: error.message });
    }
});

// RESET endpoint - calls the stored procedure to reset database
app.post('/api/reset', async (req, res) => {
    console.log('Attempting to reset database...');
    const connection = await pool.getConnection();
    
    try {
        // First try the comprehensive reset file
        console.log('Attempting comprehensive reset...');
        const fs = require('fs');
        const path = require('path');
        const resetPath = path.join(__dirname, 'reset_database.sql');
        
        if (fs.existsSync(resetPath)) {
            console.log('Reading reset_database.sql file...');
            const resetScript = fs.readFileSync(resetPath, 'utf8');
            console.log('Executing comprehensive reset script...');
            
            // Split the script into individual statements and execute them
            const statements = resetScript.split(';').filter(stmt => stmt.trim());
            
            for (const statement of statements) {
                if (statement.trim()) {
                    try {
                        await connection.execute(statement.trim());
                    } catch (stmtError) {
                        console.warn('Statement execution:', stmtError.message);
                        // Continue with other statements unless it's a critical error
                        if (!stmtError.message.includes('Unknown table') && 
                            !stmtError.message.includes("doesn't exist")) {
                            throw stmtError;
                        }
                    }
                }
            }
            console.log('Comprehensive reset completed successfully');
            res.json({ success: true, message: 'Database reset successfully using comprehensive reset file' });
            return;
        }
        
        // Fallback: check if the stored procedure exists
        console.log('Reset file not found, checking if stored procedure exists...');
        const [procedures] = await connection.execute(
            "SELECT ROUTINE_NAME FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA = DATABASE() AND ROUTINE_NAME = 'sp_reset_banana_phone_db'"
        );
        
        if (procedures.length > 0) {
            console.log('Stored procedure found, attempting to call it...');
            try {
                await connection.execute('CALL sp_reset_banana_phone_db()');
                console.log('Successfully called stored procedure');
                res.json({ success: true, message: 'Database reset successfully using stored procedure' });
                return;
            } catch (procError) {
                console.error('Stored procedure call failed:', procError);
                throw procError;
            }
        } else {
            throw new Error('No reset method available (reset_database.sql file or stored procedure not found)');
        }
        
    } catch (error) {
        console.error('Database reset error details:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sql: error.sql,
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage
        });
        res.status(500).json({ 
            success: false, 
            message: 'Database reset failed',
            error: error.message,
            code: error.code || 'UNKNOWN_ERROR'
        });
    } finally {
        connection.release();
    }
});

// Alternative reset endpoint that manually executes DDL and DML
app.post('/api/reset-manual', async (req, res) => {
    try {
        console.log('Starting manual database reset...');
        
        // Read DDL and DML files
        const fs = require('fs');
        const path = require('path');
        
        // Read the DDL file
        const ddlPath = path.join(__dirname, 'DDL.sql');
        const ddlContent = fs.readFileSync(ddlPath, 'utf8');
        
        // Read the DML file  
        const dmlPath = path.join(__dirname, 'DML.sql');
        const dmlContent = fs.readFileSync(dmlPath, 'utf8');
        
        // Execute DDL first (this will drop and recreate tables)
        console.log('Executing DDL...');
        
        // Split DDL into statements and execute them one by one
        const ddlStatements = ddlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
            
        for (const statement of ddlStatements) {
            if (statement.trim()) {
                try {
                    await pool.execute(statement);
                } catch (err) {
                    console.log('Skipping statement (may be comment or delimiter):', statement.substring(0, 50));
                }
            }
        }
        
        console.log('DDL executed successfully');
        
        // Execute DML (insert sample data)
        console.log('Executing DML...');
        const dmlStatements = dmlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
            
        for (const statement of dmlStatements) {
            if (statement.trim()) {
                try {
                    await pool.execute(statement);
                } catch (err) {
                    console.log('Skipping statement:', statement.substring(0, 50));
                }
            }
        }
        
        console.log('Manual database reset completed successfully');
        res.json({ 
            success: true, 
            message: 'Database has been reset successfully (manual method)' 
        });
    } catch (error) {
        console.error('Manual reset error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Manual database reset failed',
            error: error.message 
        });
    }
});

// READ operations - Get all events
app.get('/api/events', async (req, res) => {
    try {
        const query = 'SELECT eventID, title, startDate, endDate, location, description FROM EstateSaleEvents ORDER BY startDate DESC';
        const [results] = await pool.execute(query);
        console.log('Events query results:', results.length, 'events found');
        res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// READ operations - Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const query = 'SELECT customerID, firstName, lastName, email, phone FROM Customers ORDER BY lastName, firstName';
        const [results] = await pool.execute(query);
        console.log('Customers query results:', results.length, 'customers found');
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
                   i.startingPrice, i.status, 
                   COALESCE(e.title, 'No Event Assigned') as eventTitle
            FROM Items i
            LEFT JOIN EstateSaleEvents e ON i.eventID = e.eventID
            ORDER BY i.eventID, i.name
        `;
        const [results] = await pool.execute(query);
        console.log('Items query results:', results.length, 'items found');
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

// UPDATE operations - Edit entities

// Update customer
app.put('/api/customers/:id', async (req, res) => {
    try {
        const customerId = req.params.id;
        const { firstName, lastName, email, phone } = req.body;
        
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
        
        res.json({ 
            success: true, 
            message: 'Customer updated successfully' 
        });
    } catch (error) {
        console.error('Database update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update customer',
            error: error.message 
        });
    }
});

// Update event
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
        
        res.json({ 
            success: true, 
            message: 'Event updated successfully' 
        });
    } catch (error) {
        console.error('Database update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update event',
            error: error.message 
        });
    }
});

// Update item
app.put('/api/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const { name, description, category, startingPrice, eventID } = req.body;
        
        const query = `
            UPDATE Items 
            SET name = ?, description = ?, category = ?, startingPrice = ?, eventID = ?
            WHERE itemID = ?
        `;
        
        const [results] = await pool.execute(query, [name, description, category, startingPrice, eventID, itemId]);
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Item updated successfully' 
        });
    } catch (error) {
        console.error('Database update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update item',
            error: error.message 
        });
    }
});

// DELETE item endpoint
app.delete('/api/items/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        
        // First check if item exists and get its status
        const checkQuery = 'SELECT status FROM Items WHERE itemID = ?';
        const [checkResults] = await pool.execute(checkQuery, [itemId]);
        
        if (checkResults.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Item not found' 
            });
        }
        
        // Check if item is sold
        if (checkResults[0].status === 'Sold') {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot delete sold items. Please remove from sales first.' 
            });
        }
        
        // Delete the item
        const deleteQuery = 'DELETE FROM Items WHERE itemID = ?';
        const [results] = await pool.execute(deleteQuery, [itemId]);
        
        res.json({ 
            success: true, 
            message: 'Item deleted successfully' 
        });
    } catch (error) {
        console.error('Database delete error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete item',
            error: error.message 
        });
    }
});

// Update sale
app.put('/api/sales/:id', async (req, res) => {
    try {
        const saleId = req.params.id;
        const { customerID, saleDate, totalAmount, paymentMethod } = req.body;
        
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
        
        res.json({ 
            success: true, 
            message: 'Sale updated successfully' 
        });
    } catch (error) {
        console.error('Database update error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update sale',
            error: error.message 
        });
    }
});

// Get individual entities for editing
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
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
});

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
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});

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
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

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
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Failed to fetch sale' });
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
