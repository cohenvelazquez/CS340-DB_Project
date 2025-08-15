-- Complete database reset script
-- This script will drop all tables and recreate them with sample data

-- Disable foreign key checks to allow dropping tables
SET FOREIGN_KEY_CHECKS=0;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS SoldItems;
DROP TABLE IF EXISTS Sales;
DROP TABLE IF EXISTS Items;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS EstateSaleEvents;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS=1;

-- Create EstateSaleEvents table
CREATE TABLE EstateSaleEvents (
    eventID INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    PRIMARY KEY (eventID)
);

-- Create Customers table
CREATE TABLE Customers (
    customerID INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    PRIMARY KEY (customerID)
);

-- Create Items table
CREATE TABLE Items (
    itemID INT NOT NULL AUTO_INCREMENT,
    eventID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    startingPrice DECIMAL(10,2) NOT NULL,
    status ENUM('Available', 'Sold', 'Held') DEFAULT 'Available',
    PRIMARY KEY (itemID),
    FOREIGN KEY (eventID) REFERENCES EstateSaleEvents(eventID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Sales table
CREATE TABLE Sales (
    saleID INT NOT NULL AUTO_INCREMENT,
    customerID INT NOT NULL,
    saleDate DATETIME NOT NULL,
    totalAmount DECIMAL(10,2) NOT NULL,
    paymentMethod ENUM('Cash', 'Credit Card', 'Check') NOT NULL,
    PRIMARY KEY (saleID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create SoldItems table
CREATE TABLE SoldItems (
    soldItemID INT NOT NULL AUTO_INCREMENT,
    saleID INT NOT NULL,
    itemID INT NOT NULL,
    unitPrice DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (soldItemID),
    FOREIGN KEY (saleID) REFERENCES Sales(saleID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (itemID) REFERENCES Items(itemID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert sample data for EstateSaleEvents
INSERT INTO EstateSaleEvents (title, startDate, endDate, location, description) VALUES
('Victorian Manor Estate Sale', '2025-08-01 09:00:00', '2025-08-03 16:00:00', '1234 Oak Street, Portland, OR 97201', 'Beautiful Victorian home with antique furniture, china, and collectibles'),
('Mid-Century Modern Collection', '2025-08-15 10:00:00', '2025-08-17 15:00:00', '5678 Pine Avenue, Beaverton, OR 97005', 'Stunning collection of 1950s-60s furniture and decor'),
('Collector''s Paradise Sale', '2025-09-01 08:00:00', '2025-09-02 17:00:00', '9012 Maple Drive, Lake Oswego, OR 97034', 'Rare books, coins, stamps, and vintage toys'),
('Garden Estate Sale', '2025-09-15 09:30:00', '2025-09-16 16:30:00', '3456 Elm Street, Tigard, OR 97223', 'Beautiful home with extensive garden tools and outdoor furniture'),
('Art Lover''s Estate', '2025-10-01 10:00:00', '2025-10-03 14:00:00', '7890 Cedar Lane, Milwaukie, OR 97222', 'Original paintings, sculptures, and art supplies');

-- Insert sample data for Customers
INSERT INTO Customers (firstName, lastName, email, phone) VALUES
('Sarah', 'Johnson', 'sarah.johnson@email.com', '503-555-0101'),
('Michael', 'Chen', 'mchen@email.com', '503-555-0102'),
('Emily', 'Rodriguez', 'emily.r@email.com', '503-555-0103'),
('David', 'Thompson', 'dthompson@email.com', '503-555-0104'),
('Lisa', 'Anderson', 'lisa.anderson@email.com', '503-555-0105');

-- Insert sample data for Items
INSERT INTO Items (eventID, name, category, description, startingPrice, status) VALUES
-- Items for Victorian Manor Estate Sale (eventID = 1)
(1, 'Mahogany Dining Table', 'Furniture', 'Antique mahogany dining table seats 8, circa 1890', 450.00, 'Available'),
(1, 'Royal Doulton China Set', 'China', 'Complete 12-place setting with serving pieces', 275.00, 'Sold'),
(1, 'Victorian Jewelry Box', 'Collectibles', 'Hand-carved wooden jewelry box with velvet interior', 125.00, 'Available'),
(1, 'Persian Rug', 'Home Decor', 'Hand-woven Persian rug 8x10 feet, excellent condition', 800.00, 'Held'),

-- Items for Mid-Century Modern Collection (eventID = 2)
(2, 'Eames Lounge Chair', 'Furniture', 'Authentic Herman Miller Eames chair and ottoman', 1200.00, 'Available'),
(2, 'Atomic Clock', 'Decor', 'Sunburst atomic wall clock from the 1960s', 85.00, 'Sold'),
(2, 'Boomerang Coffee Table', 'Furniture', 'Kidney-shaped coffee table with hairpin legs', 320.00, 'Available'),

-- Items for Collector's Paradise Sale (eventID = 3)
(3, 'First Edition Hemingway', 'Books', 'The Old Man and the Sea, first edition 1952', 500.00, 'Available'),
(3, '1964 Kennedy Half Dollar', 'Coins', 'Uncirculated condition silver half dollar', 25.00, 'Sold'),
(3, 'Lionel Train Set', 'Toys', 'Complete O-gauge train set with accessories', 350.00, 'Available'),

-- Items for Garden Estate Sale (eventID = 4)
(4, 'Teak Patio Set', 'Outdoor', '6-piece teak patio furniture set with cushions', 650.00, 'Available'),
(4, 'Vintage Garden Tools', 'Tools', 'Collection of well-maintained vintage garden tools', 75.00, 'Available'),

-- Items for Art Lover's Estate (eventID = 5)
(5, 'Oil Painting Landscape', 'Art', 'Original oil painting by local artist, framed', 225.00, 'Available'),
(5, 'Bronze Sculpture', 'Art', 'Small bronze sculpture of a dancer, signed', 180.00, 'Available');

-- Insert sample data for Sales
INSERT INTO Sales (customerID, saleDate, totalAmount, paymentMethod) VALUES
(1, '2025-08-01 14:30:00', 275.00, 'Credit Card'),
(2, '2025-08-15 11:45:00', 85.00, 'Cash'),
(3, '2025-09-01 16:20:00', 25.00, 'Cash'),
(1, '2025-08-02 10:15:00', 125.00, 'Credit Card'),
(4, '2025-08-16 13:30:00', 320.00, 'Check');

-- Insert sample data for SoldItems
INSERT INTO SoldItems (saleID, itemID, unitPrice, quantity) VALUES
-- Sale 1: Sarah bought Royal Doulton China Set
(1, 2, 275.00, 1),
-- Sale 2: Michael bought Atomic Clock
(2, 6, 85.00, 1),
-- Sale 3: Emily bought Kennedy Half Dollar
(3, 9, 25.00, 1),
-- Sale 4: Sarah bought Victorian Jewelry Box
(4, 3, 125.00, 1),
-- Sale 5: David bought Boomerang Coffee Table
(5, 7, 320.00, 1);
