# Project Step 4 Report - Banana Phone Estate Services

## Authors
- **Cohen Velazquez**
- **Joseph Lucciano Barberan**  
- **Group**: 80
- **Course**: CS 340 - Databases
- **Date**: August 7, 2025

---

## Project Overview

Banana Phone Estate Services is a comprehensive estate sale management system designed to help estate sale companies organize events, manage inventory, track customers, and record sales transactions. The system provides a complete workflow from event planning to final sales reporting.

### Business Problem
Estate sale companies need an efficient way to:
- Organize and schedule estate sale events
- Catalog items for sale with detailed descriptions and pricing
- Manage customer information and purchase history
- Track sales transactions and inventory status
- Generate reports on sales performance

### Solution
Our web-based management system provides:
- Centralized event management with scheduling
- Comprehensive item cataloging with categories and status tracking
- Customer relationship management with purchase history
- Sales transaction recording with payment tracking
- Real-time inventory and sales reporting

---

## Database Outline

### Entities and Relationships

1. **EstateSaleEvents** (1:M with Items)
   - Primary entity representing scheduled estate sales
   - Contains event details, dates, and location information

2. **Items** (M:1 with EstateSaleEvents, 1:M with SoldItems)
   - Inventory items available at estate sales
   - Linked to specific events, tracked by status (Available/Sold/Held)

3. **Customers** (1:M with Sales)
   - Customer information and contact details
   - Tracks customer registration and purchase history

4. **Sales** (M:1 with Customers, 1:M with SoldItems)
   - Individual sales transactions
   - Records payment method, date, and total amount

5. **SoldItems** (M:1 with Sales, M:1 with Items)
   - Intersection entity tracking which items were sold in which sales
   - Handles quantity and unit pricing for each item in a sale

---

## Entity Relationship Diagram (ERD)

```
[EstateSaleEvents] 1----M [Items] M----1 [SoldItems] M----1 [Sales] M----1 [Customers]
```

### Detailed Relationships:
- EstateSaleEvents → Items (One event can have many items)
- Items → SoldItems (One item can be sold multiple times with different quantities)
- Sales → SoldItems (One sale can include multiple items)
- Customers → Sales (One customer can make multiple purchases)

---

## Schema Diagram

### EstateSaleEvents
- eventID (PK, INT, AUTO_INCREMENT)
- title (VARCHAR(100), NOT NULL)
- startDate (DATETIME, NOT NULL)
- endDate (DATETIME, NOT NULL)
- location (VARCHAR(200), NOT NULL)
- description (TEXT)

### Items
- itemID (PK, INT, AUTO_INCREMENT)
- eventID (FK, INT, NOT NULL) → EstateSaleEvents.eventID
- name (VARCHAR(100), NOT NULL)
- category (VARCHAR(50))
- description (TEXT)
- startingPrice (DECIMAL(10,2), NOT NULL)
- status (ENUM('Available','Sold','Held'), DEFAULT 'Available')

### Customers
- customerID (PK, INT, AUTO_INCREMENT)
- firstName (VARCHAR(50), NOT NULL)
- lastName (VARCHAR(50), NOT NULL)
- email (VARCHAR(100), UNIQUE, NOT NULL)
- phone (VARCHAR(20))
- created_at (DATETIME, DEFAULT CURRENT_TIMESTAMP)

### Sales
- saleID (PK, INT, AUTO_INCREMENT)
- customerID (FK, INT, NOT NULL) → Customers.customerID
- saleDate (DATETIME, NOT NULL)
- totalAmount (DECIMAL(10,2), NOT NULL)
- paymentMethod (ENUM('Cash','Credit Card','Check'), NOT NULL)

### SoldItems
- saleID (FK, INT, NOT NULL) → Sales.saleID
- itemID (FK, INT, NOT NULL) → Items.itemID
- unitPrice (DECIMAL(10,2), NOT NULL)
- quantity (INT, DEFAULT 1)
- PRIMARY KEY (saleID, itemID)

---

## Sample Data Summary

### EstateSaleEvents (5 events)
- Victorian Manor Estate Sale (Portland)
- Mid-Century Modern Collection (Beaverton)
- Collector's Paradise Sale (Lake Oswego)
- Garden Estate Sale (Tigard)
- Art Lover's Estate (Milwaukie)

### Customers (5 customers)
- Sarah Johnson, Michael Chen, Emily Rodriguez, David Thompson, Lisa Anderson

### Items (14 items across various categories)
- Furniture, China, Collectibles, Art, Books, Coins, Tools, etc.

### Sales (5 transactions)
- Total revenue: $830.00
- Payment methods: Cash, Credit Card, Check

---

## Fixes Based on Previous Feedback

### Step 2 Feedback Applied:
1. **Database Normalization**: Applied 3NF principles to eliminate redundancy
2. **Foreign Key Constraints**: Added proper CASCADE relationships
3. **Data Types**: Improved precision for monetary values (DECIMAL instead of FLOAT)
4. **Enum Values**: Added proper constraints for status and payment methods

### Step 3 Feedback Applied:
1. **Query Optimization**: Improved JOIN performance with proper indexing
2. **Data Validation**: Added NOT NULL constraints where appropriate
3. **Sample Data**: Enhanced sample data to better represent real-world scenarios

### Peer Review Feedback:
- **UI Improvements**: Enhanced navigation and user experience
- **Error Handling**: Added proper error messages and validation
- **Documentation**: Improved code comments and documentation

---

## Technical Implementation (Step 4)

### Technology Stack
- **Backend**: Node.js with Express.js framework
- **Database**: MySQL with mysql2 driver for connection pooling
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Deployment**: OSU ENGR servers

### Key Features Implemented

#### 1. Database Reset Functionality
- **PL/SQL Wrapper**: `sp_reset_banana_phone_db()` stored procedure
- **Reset Button**: Available on homepage and management pages
- **Complete Reset**: Drops and recreates all tables with sample data

#### 2. READ Operations (SELECT Queries)
- **Events API**: `/api/events` - Displays all estate sale events
- **Customers API**: `/api/customers` - Shows customer information
- **Items API**: `/api/items` - Lists items with event relationships
- **Sales API**: `/api/sales` - Displays sales with customer data
- **Sold Items API**: `/api/solditems` - Shows intersection table data

#### 3. Demonstration CUD Operation
- **Delete Customer**: Implemented via `sp_delete_customer()` stored procedure
- **API Endpoint**: `DELETE /api/customers/:id`
- **Cascade Handling**: Properly manages related sales data

### Database Architecture

#### Connection Management
```javascript
const pool = mysql.createPool({
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_velazquc',
    password: '[password]',
    database: 'cs340_velazquc',
    multipleStatements: true
});
```

#### Stored Procedures
1. **sp_reset_banana_phone_db()**: Complete database reset
2. **sp_delete_customer(customer_id)**: Safe customer deletion with transaction handling

### API Architecture

#### RESTful Endpoints
- `GET /` - Homepage with dashboard
- `POST /api/reset` - Database reset functionality
- `GET /api/[entity]` - READ operations for all entities
- `DELETE /api/customers/:id` - Demonstration CUD operation

#### Error Handling
- Database connection errors
- SQL execution errors
- HTTP status codes for different error types
- User-friendly error messages

---

## Current Status and Future Work

### What Works (Step 4 Requirements Met)
✅ **Database Reset**: Fully functional with stored procedure
✅ **READ Operations**: All entities display real-time database data
✅ **One CUD Operation**: Customer deletion for reset demonstration
✅ **Web Interface**: Professional, responsive design
✅ **API Endpoints**: RESTful architecture with proper error handling

### What Doesn't Work (Not Required for Step 4)
- **INSERT Operations**: Forms exist but submission not implemented
- **UPDATE Operations**: Edit functionality planned for Step 5
- **Complex Transactions**: Multi-table operations planned for future steps
- **Authentication**: User management not yet implemented

### Next Steps (Step 5 and Beyond)
1. **Complete CRUD Operations**: Implement all INSERT, UPDATE, DELETE operations
2. **Form Validation**: Client and server-side validation
3. **Advanced Features**: Search, filtering, sorting capabilities
4. **Report Generation**: Sales reports, inventory summaries
5. **User Authentication**: Admin and user role management
6. **Performance Optimization**: Query optimization, caching

---

## Conclusion

Project Step 4 successfully demonstrates a functional web application with database connectivity. The system provides a solid foundation for estate sale management with proper database design, RESTful API architecture, and a user-friendly interface. The reset functionality and READ operations work as required, with one CUD operation implemented for demonstration purposes.

The project applies database design principles learned in the course, including normalization, foreign key relationships, and stored procedures. Future iterations will expand the functionality to provide a complete estate sale management solution.

---

## Appendix

### Database Schema SQL
See `DDL.sql` for complete table definitions and sample data

### Data Manipulation Queries  
See `DML.sql` for all SELECT, INSERT, UPDATE, DELETE queries

### Stored Procedures
See `PL.sql` for additional PL/SQL code and procedures

### Source Code
Complete source code available in the project directory structure
