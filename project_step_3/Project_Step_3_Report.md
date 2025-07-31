# Banana Phone Estate Services Sales Management System
## Project Step 3 - Web Application Frontend

**Authors:** Cohen Velazquez and Joseph Lucciano Barberan  
**Group:** 80  
**Date:** July 31, 2025  

**Website URL:** http://classwork.engr.oregonstate.edu:9124

---

## Table of Contents
1. [Project Outline and Database Outline, ERD Schema & Sample Data - Updated Version](#project-outline-and-database-outline-erd-schema--sample-data---updated-version)
2. [Fixes Based on Feedback from Previous Steps](#fixes-based-on-feedback-from-previous-steps)
3. [Web Application Overview](#web-application-overview)
4. [User Interface Pages](#user-interface-pages)
5. [Database Integration](#database-integration)

---

## 1. Project Outline and Database Outline, ERD Schema & Sample Data - Updated Version

### Business Overview
Banana Phone Estate Services is an estate sale company that manages roughly 100 estate-sale events per year across the Portland Metro area, each featuring on average 1,000 one-of-a-kind items (antiques, furniture, collectibles, etc.), meaning each item is sold only once. Annually the company facilitates around 100,000 item transactions, generating approximately $3 million in gross sales. 

**Current Problems:** Banana Phone Estate Services currently relies on manual processes and disconnected tools to manage inventory and sales, leading to data entry errors, inconsistent reporting, and time-consuming reconciliation. Without a centralized system, it's difficult to track items across events or analyze sales trends, limiting the company's ability to make informed pricing and planning decisions.

**Solution:** A database-driven website will let staff define each Event, catalog Items, record Customer purchases (Sales) with line items, and produce financial and inventory reports in real time.

### Updated Database Schema

#### Events Table
- **eventID:** INT, AUTO_INCREMENT, PK, NOT NULL
- **title:** VARCHAR(100), NOT NULL
- **startDate:** DATETIME, NOT NULL
- **endDate:** DATETIME, NOT NULL
- **location:** VARCHAR(200), NOT NULL
- **description:** TEXT, nullable

#### Items Table
- **itemID:** INT, AUTO_INCREMENT, PK, NOT NULL
- **eventID:** INT, NOT NULL, FK → Events(eventID)
- **name:** VARCHAR(100), NOT NULL
- **category:** VARCHAR(50), nullable
- **description:** TEXT, nullable
- **startingPrice:** DECIMAL(10,2), NOT NULL
- **status:** ENUM('Available','Sold','Held'), NOT NULL, default 'Available'

#### Customers Table
- **customerID:** INT, AUTO_INCREMENT, PK, NOT NULL
- **firstName:** VARCHAR(50), NOT NULL
- **lastName:** VARCHAR(50), NOT NULL
- **email:** VARCHAR(100), UNIQUE, NOT NULL
- **phone:** VARCHAR(20), nullable
- **created_at:** DATETIME, NOT NULL, default CURRENT_TIMESTAMP

#### Sales Table
- **saleID:** INT, AUTO_INCREMENT, PK, NOT NULL
- **customerID:** INT, NOT NULL, FK → Customers(customerID)
- **eventID:** INT, NOT NULL, FK → Events(eventID)
- **saleDate:** DATETIME, NOT NULL
- **totalAmount:** DECIMAL(10,2), NOT NULL
- **paymentMethod:** ENUM('Cash','Credit Card','Check'), NOT NULL

#### SoldItems Table (Intersection Table)
- **saleID:** INT, NOT NULL, FK → Sales(saleID), PK (composite)
- **itemID:** INT, NOT NULL, FK → Items(itemID), PK (composite)
- **unitPrice:** DECIMAL(10,2), NOT NULL
- **quantity:** INT, NOT NULL, default 1

### Entity Relationships
- **Events → Items:** One-to-Many (1:M)
- **Events → Sales:** One-to-Many (1:M)
- **Customers → Sales:** One-to-Many (1:M)
- **Sales ↔ Items:** Many-to-Many (M:N) via SoldItems intersection table

### Sample Data Summary
- **5 Events** spanning different themes and dates
- **14 Items** across various categories and price points
- **5 Customers** with contact information
- **5 Sales** transactions with different payment methods
- **5 SoldItems** records showing item-sale relationships

---

## 2. Fixes Based on Feedback from Previous Steps

### From Step 1 Feedback:
1. **Enhanced Problem Description:** Added detailed description of current manual processes and their limitations in the business overview.

2. **Naming Consistency:** Maintained consistent singular naming for all entities (Event, Item, Customer, Sale, SoldItem).

3. **Attribute Naming:** Kept `created_at` as is for database compatibility while ensuring clear documentation.

4. **Relationship Clarification:** Clearly documented the M:N relationship between Sales and Items via the SoldItems intersection table.

### From Step 2 Feedback:
1. **Database Normalization:** Verified all tables meet 1NF, 2NF, and 3NF requirements.

2. **Foreign Key Constraints:** Implemented CASCADE options for proper referential integrity.

3. **Data Types:** Reviewed and optimized data types for all attributes.

### New Improvements for Step 3:
1. **Web Interface Design:** Created intuitive, user-friendly interface following modern web design principles.

2. **CRUD Operations:** Designed complete interfaces for Create, Read, Update, Delete operations on all entities.

3. **Data Validation:** Implemented client-side form validation and user experience enhancements.

4. **Responsive Design:** Ensured website works across different device sizes and screen resolutions.

---

## 3. Web Application Overview

### Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js with Express.js
- **Database:** MySQL/MariaDB
- **Styling:** Custom CSS with responsive design
- **Server:** ENGR servers (classwork.engr.oregonstate.edu:9124)

### Application Features
- **Dashboard Homepage:** Overview of system with navigation to all sections
- **Event Management:** Create, view, edit estate sale events
- **Item Cataloging:** Add, browse, search, and manage inventory items
- **Customer Management:** Maintain customer database with contact information
- **Sales Processing:** Record transactions and manage sold items
- **Reporting:** View summaries and statistics

### Design Principles
- **User-Friendly Interface:** Clean, intuitive design with clear navigation
- **Responsive Layout:** Works on desktop, tablet, and mobile devices
- **Consistent Styling:** Unified color scheme and typography throughout
- **Accessibility:** Proper contrast, labels, and semantic HTML
- **Data Integrity:** Form validation and error prevention

---

## 4. User Interface Pages

### 4.1 Homepage (index.html)
**Purpose:** Main landing page with navigation to all sections
**Features:**
- Company overview and statistics
- Grid-based navigation to all major sections
- Business metrics display (events per year, revenue, etc.)
- Responsive card-based layout

### 4.2 Events Management
**Browse Events (events.html):**
- Tabular display of all estate sale events
- Status indicators (upcoming, planning, completed)
- Action buttons for editing and viewing related items
- Search and filter capabilities

**Add New Event (events-add.html):**
- Form for creating new estate sale events
- Date/time pickers for start and end dates
- Location and description fields
- Form validation and user guidelines

### 4.3 Items Management
**Browse Items (items.html):**
- Comprehensive item catalog with filtering
- Event association display
- Status indicators (Available, Sold, Held)
- Category-based filtering
- Price and description information

**Add New Item (items-add.html):**
- Item creation form with event selection
- Category dropdown with predefined options
- Price input with decimal validation
- Description text area for detailed information

### 4.4 Customer Management
**Browse Customers (customers.html):**
- Customer list with contact information
- Purchase history summary
- Total spending calculations
- Search functionality

**Add New Customer (customers-add.html):**
- Customer registration form
- Email validation and uniqueness checking
- Phone number formatting
- Required field validation

### 4.5 Sales & Transactions
**Browse Sales (sales.html):**
- Sales transaction history
- Customer and event association
- Payment method breakdown
- Total revenue calculations
- Date filtering capabilities

**Record New Sale (sales-add.html):**
- Transaction recording form
- Customer and event selection
- Payment method options
- Amount validation

**Sold Items Management (solditems.html):**
- Intersection table display
- Item-sale relationship management
- Quantity and pricing details
- Line total calculations

---

## 5. Database Integration

### 5.1 Current Implementation Status
For Project Step 3, we have implemented:
- **Frontend UI Pages:** Complete set of user interface pages
- **Basic Server Structure:** Express.js server serving static pages
- **Form Layouts:** All forms ready for backend integration
- **Sample Data Display:** Static data matching database contents

### 5.2 Planned Backend Integration (Future Steps)
- **Database Connection:** MySQL connection pool setup
- **API Endpoints:** RESTful API for CRUD operations
- **Query Implementation:** Execution of DML queries
- **Error Handling:** Proper error responses and validation
- **Session Management:** User authentication if needed

### 5.3 Data Manipulation Queries
Our DML.sql file includes comprehensive queries for:
- **SELECT:** Browse and search operations for all entities
- **INSERT:** Creating new records in all tables
- **UPDATE:** Modifying existing data
- **DELETE:** Removing records with proper cascade handling
- **REPORTING:** Summary and analytical queries

### 5.4 Query Variable Convention
All queries use `@variableName` notation to indicate data that will be supplied by backend code:
- `@titleInput` - User-provided event title
- `@customerIdInput` - Selected customer ID
- `@searchTermInput` - Search query text
- `@startDateInput` - Date range filters

---

## Conclusion

This Project Step 3 implementation provides a comprehensive frontend for the Banana Phone Estate Services management system. The web application successfully translates our database schema into an intuitive user interface that supports all required CRUD operations.

**Key Achievements:**
- Complete set of responsive web pages
- Intuitive navigation and user experience
- Form validation and user guidance
- Comprehensive data display with filtering/search
- Professional design with consistent styling
- Ready for backend integration in future steps

**Next Steps:**
- Implement database connectivity
- Add server-side query execution
- Integrate form processing with database operations
- Add real-time data updates
- Implement user authentication and sessions

The application successfully demonstrates the frontend requirements for Project Step 3 while maintaining the database design integrity from previous steps.
