-- Banana Phone Estate Services Sales Management System
-- Data Manipulation Queries (DML)
-- Authors: Cohen Velazquez and Joseph Lucciano Barberan
-- Group: 80
-- Date: July 31, 2025

-- Variable notation: @variableName represents data that will be provided by backend code

-- =============================================================================
-- EVENTS QUERIES
-- =============================================================================

-- Browse/Display all Events
SELECT eventID, title, startDate, endDate, location, description 
FROM Events 
ORDER BY startDate DESC;

-- Get a single Event by ID for editing
SELECT eventID, title, startDate, endDate, location, description 
FROM Events 
WHERE eventID = @eventIdInput;

-- Add a new Event
INSERT INTO Events (title, startDate, endDate, location, description)
VALUES (@titleInput, @startDateInput, @endDateInput, @locationInput, @descriptionInput);

-- Update an existing Event
UPDATE Events 
SET title = @titleInput, 
    startDate = @startDateInput, 
    endDate = @endDateInput, 
    location = @locationInput, 
    description = @descriptionInput
WHERE eventID = @eventIdInput;

-- Delete an Event (will cascade to related Items and Sales)
DELETE FROM Events WHERE eventID = @eventIdInput;

-- Search Events by title or location
SELECT eventID, title, startDate, endDate, location, description 
FROM Events 
WHERE title LIKE CONCAT('%', @searchTermInput, '%') 
   OR location LIKE CONCAT('%', @searchTermInput, '%')
ORDER BY startDate DESC;

-- =============================================================================
-- ITEMS QUERIES
-- =============================================================================

-- Browse/Display all Items with Event information
SELECT 
    i.itemID, 
    i.name, 
    i.category, 
    i.description, 
    i.startingPrice, 
    i.status,
    e.title AS eventTitle,
    e.eventID
FROM Items i
INNER JOIN Events e ON i.eventID = e.eventID
ORDER BY i.itemID;

-- Get Items for a specific Event
SELECT itemID, name, category, description, startingPrice, status
FROM Items 
WHERE eventID = @eventIdInput
ORDER BY name;

-- Get a single Item by ID for editing
SELECT itemID, eventID, name, category, description, startingPrice, status
FROM Items 
WHERE itemID = @itemIdInput;

-- Add a new Item
INSERT INTO Items (eventID, name, category, description, startingPrice, status)
VALUES (@eventIdInput, @nameInput, @categoryInput, @descriptionInput, @startingPriceInput, @statusInput);

-- Update an existing Item
UPDATE Items 
SET eventID = @eventIdInput,
    name = @nameInput, 
    category = @categoryInput, 
    description = @descriptionInput, 
    startingPrice = @startingPriceInput, 
    status = @statusInput
WHERE itemID = @itemIdInput;

-- Delete an Item
DELETE FROM Items WHERE itemID = @itemIdInput;

-- Search Items by name or category
SELECT 
    i.itemID, 
    i.name, 
    i.category, 
    i.description, 
    i.startingPrice, 
    i.status,
    e.title AS eventTitle
FROM Items i
INNER JOIN Events e ON i.eventID = e.eventID
WHERE i.name LIKE CONCAT('%', @searchTermInput, '%') 
   OR i.category LIKE CONCAT('%', @searchTermInput, '%')
ORDER BY i.name;

-- Filter Items by status
SELECT 
    i.itemID, 
    i.name, 
    i.category, 
    i.startingPrice, 
    i.status,
    e.title AS eventTitle
FROM Items i
INNER JOIN Events e ON i.eventID = e.eventID
WHERE i.status = @statusInput
ORDER BY i.name;

-- Update Item status (when sold/held)
UPDATE Items 
SET status = @statusInput
WHERE itemID = @itemIdInput;

-- =============================================================================
-- CUSTOMERS QUERIES
-- =============================================================================

-- Browse/Display all Customers with purchase summary
SELECT 
    c.customerID, 
    c.firstName, 
    c.lastName, 
    c.email, 
    c.phone, 
    c.created_at,
    COALESCE(SUM(s.totalAmount), 0) AS totalPurchases,
    COUNT(s.saleID) AS numberOfSales
FROM Customers c
LEFT JOIN Sales s ON c.customerID = s.customerID
GROUP BY c.customerID, c.firstName, c.lastName, c.email, c.phone, c.created_at
ORDER BY c.lastName, c.firstName;

-- Get a single Customer by ID for editing
SELECT customerID, firstName, lastName, email, phone, created_at
FROM Customers 
WHERE customerID = @customerIdInput;

-- Add a new Customer
INSERT INTO Customers (firstName, lastName, email, phone)
VALUES (@firstNameInput, @lastNameInput, @emailInput, @phoneInput);

-- Update an existing Customer
UPDATE Customers 
SET firstName = @firstNameInput, 
    lastName = @lastNameInput, 
    email = @emailInput, 
    phone = @phoneInput
WHERE customerID = @customerIdInput;

-- Delete a Customer (will cascade to related Sales)
DELETE FROM Customers WHERE customerID = @customerIdInput;

-- Search Customers by name or email
SELECT customerID, firstName, lastName, email, phone, created_at
FROM Customers 
WHERE firstName LIKE CONCAT('%', @searchTermInput, '%') 
   OR lastName LIKE CONCAT('%', @searchTermInput, '%')
   OR email LIKE CONCAT('%', @searchTermInput, '%')
ORDER BY lastName, firstName;

-- Get Customer by email (for login/lookup)
SELECT customerID, firstName, lastName, email, phone, created_at
FROM Customers 
WHERE email = @emailInput;

-- =============================================================================
-- SALES QUERIES
-- =============================================================================

-- Browse/Display all Sales with Customer and Event information
SELECT 
    s.saleID,
    s.saleDate,
    s.totalAmount,
    s.paymentMethod,
    CONCAT(c.firstName, ' ', c.lastName) AS customerName,
    e.title AS eventTitle,
    s.customerID,
    s.eventID
FROM Sales s
INNER JOIN Customers c ON s.customerID = c.customerID
INNER JOIN Events e ON s.eventID = e.eventID
ORDER BY s.saleDate DESC;

-- Get Sales for a specific Customer
SELECT 
    s.saleID,
    s.saleDate,
    s.totalAmount,
    s.paymentMethod,
    e.title AS eventTitle
FROM Sales s
INNER JOIN Events e ON s.eventID = e.eventID
WHERE s.customerID = @customerIdInput
ORDER BY s.saleDate DESC;

-- Get Sales for a specific Event
SELECT 
    s.saleID,
    s.saleDate,
    s.totalAmount,
    s.paymentMethod,
    CONCAT(c.firstName, ' ', c.lastName) AS customerName
FROM Sales s
INNER JOIN Customers c ON s.customerID = c.customerID
WHERE s.eventID = @eventIdInput
ORDER BY s.saleDate DESC;

-- Get a single Sale by ID for details
SELECT 
    s.saleID,
    s.customerID,
    s.eventID,
    s.saleDate,
    s.totalAmount,
    s.paymentMethod,
    CONCAT(c.firstName, ' ', c.lastName) AS customerName,
    e.title AS eventTitle
FROM Sales s
INNER JOIN Customers c ON s.customerID = c.customerID
INNER JOIN Events e ON s.eventID = e.eventID
WHERE s.saleID = @saleIdInput;

-- Add a new Sale
INSERT INTO Sales (customerID, eventID, saleDate, totalAmount, paymentMethod)
VALUES (@customerIdInput, @eventIdInput, @saleDateInput, @totalAmountInput, @paymentMethodInput);

-- Update an existing Sale
UPDATE Sales 
SET customerID = @customerIdInput,
    eventID = @eventIdInput,
    saleDate = @saleDateInput,
    totalAmount = @totalAmountInput,
    paymentMethod = @paymentMethodInput
WHERE saleID = @saleIdInput;

-- Delete a Sale (will cascade to related SoldItems)
DELETE FROM Sales WHERE saleID = @saleIdInput;

-- Get Sales by date range
SELECT 
    s.saleID,
    s.saleDate,
    s.totalAmount,
    s.paymentMethod,
    CONCAT(c.firstName, ' ', c.lastName) AS customerName,
    e.title AS eventTitle
FROM Sales s
INNER JOIN Customers c ON s.customerID = c.customerID
INNER JOIN Events e ON s.eventID = e.eventID
WHERE s.saleDate BETWEEN @startDateInput AND @endDateInput
ORDER BY s.saleDate DESC;

-- =============================================================================
-- SOLDITEMS QUERIES (Intersection Table)
-- =============================================================================

-- Browse/Display all SoldItems with complete information
SELECT 
    si.saleID,
    si.itemID,
    si.unitPrice,
    si.quantity,
    (si.unitPrice * si.quantity) AS lineTotal,
    i.name AS itemName,
    i.category AS itemCategory,
    CONCAT(c.firstName, ' ', c.lastName) AS customerName,
    e.title AS eventTitle,
    s.saleDate
FROM SoldItems si
INNER JOIN Items i ON si.itemID = i.itemID
INNER JOIN Sales s ON si.saleID = s.saleID
INNER JOIN Customers c ON s.customerID = c.customerID
INNER JOIN Events e ON s.eventID = e.eventID
ORDER BY s.saleDate DESC, si.saleID;

-- Get SoldItems for a specific Sale
SELECT 
    si.saleID,
    si.itemID,
    si.unitPrice,
    si.quantity,
    (si.unitPrice * si.quantity) AS lineTotal,
    i.name AS itemName,
    i.category AS itemCategory
FROM SoldItems si
INNER JOIN Items i ON si.itemID = i.itemID
WHERE si.saleID = @saleIdInput
ORDER BY i.name;

-- Get SoldItems for a specific Item (should be only one since items are unique)
SELECT 
    si.saleID,
    si.itemID,
    si.unitPrice,
    si.quantity,
    s.saleDate,
    CONCAT(c.firstName, ' ', c.lastName) AS customerName
FROM SoldItems si
INNER JOIN Sales s ON si.saleID = s.saleID
INNER JOIN Customers c ON s.customerID = c.customerID
WHERE si.itemID = @itemIdInput;

-- Add a new SoldItem (when item is sold)
INSERT INTO SoldItems (saleID, itemID, unitPrice, quantity)
VALUES (@saleIdInput, @itemIdInput, @unitPriceInput, @quantityInput);

-- Update SoldItem quantity or price
UPDATE SoldItems 
SET unitPrice = @unitPriceInput, 
    quantity = @quantityInput
WHERE saleID = @saleIdInput AND itemID = @itemIdInput;

-- Delete a SoldItem (remove item from sale)
DELETE FROM SoldItems 
WHERE saleID = @saleIdInput AND itemID = @itemIdInput;

-- =============================================================================
-- REPORTING QUERIES
-- =============================================================================

-- Sales summary by Event
SELECT 
    e.eventID,
    e.title AS eventTitle,
    e.startDate,
    e.endDate,
    COUNT(DISTINCT s.saleID) AS totalSales,
    COUNT(DISTINCT si.itemID) AS itemsSold,
    COALESCE(SUM(s.totalAmount), 0) AS totalRevenue,
    COALESCE(AVG(s.totalAmount), 0) AS averageSale
FROM Events e
LEFT JOIN Sales s ON e.eventID = s.eventID
LEFT JOIN SoldItems si ON s.saleID = si.saleID
GROUP BY e.eventID, e.title, e.startDate, e.endDate
ORDER BY e.startDate DESC;

-- Top customers by total purchases
SELECT 
    c.customerID,
    CONCAT(c.firstName, ' ', c.lastName) AS customerName,
    c.email,
    COUNT(s.saleID) AS numberOfPurchases,
    COALESCE(SUM(s.totalAmount), 0) AS totalSpent,
    COALESCE(AVG(s.totalAmount), 0) AS averagePurchase
FROM Customers c
LEFT JOIN Sales s ON c.customerID = s.customerID
GROUP BY c.customerID, c.firstName, c.lastName, c.email
HAVING totalSpent > 0
ORDER BY totalSpent DESC;

-- Items by category summary
SELECT 
    category,
    COUNT(*) AS totalItems,
    SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) AS availableItems,
    SUM(CASE WHEN status = 'Sold' THEN 1 ELSE 0 END) AS soldItems,
    SUM(CASE WHEN status = 'Held' THEN 1 ELSE 0 END) AS heldItems,
    AVG(startingPrice) AS averageStartingPrice
FROM Items
WHERE category IS NOT NULL
GROUP BY category
ORDER BY totalItems DESC;

-- Payment method breakdown
SELECT 
    paymentMethod,
    COUNT(*) AS numberOfSales,
    SUM(totalAmount) AS totalAmount,
    AVG(totalAmount) AS averageAmount,
    (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM Sales)) AS percentageOfSales
FROM Sales
GROUP BY paymentMethod
ORDER BY totalAmount DESC;
