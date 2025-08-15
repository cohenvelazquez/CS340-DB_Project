# Project Step 5 - Banana Phone Estate Services Web Application

## Website URL
**http://classwork.engr.oregonstate.edu:6144**

## Project Overview

This is the Project Step 5 implementation of the Banana Phone Estate Services Estate Sale Management System. This step represents the complete implementation of a full-stack web application with comprehensive CRUD operations, database connectivity, stored procedures, and a professional user interface. All requirements for Project Step 5 have been implemented and tested.

## Technology Stack

- **Backend**: Node.js with Express.js and optimized connection pooling
- **Database**: MySQL with mysql2 driver and comprehensive stored procedures
- **Frontend**: HTML, CSS, JavaScript (vanilla) with modern API patterns
- **Server**: Deployed on OSU ENGR servers with production-ready configuration
- **Security**: SQL injection protection via parameterized stored procedures

## Project Step 5 - Complete Implementation Features

### Complete CRUD Operations for ALL Entities
- **CREATE**: Full form implementation for all entities with validation
- **READ**: Dynamic data loading with search and filter capabilities  
- **UPDATE**: Edit forms for all entities with real-time validation
- **DELETE**: Safe deletion with confirmation dialogs and cascade handling

### Comprehensive Stored Procedures (PL.sql)
- **22+ Stored Procedures**: Complete CRUD operations for all entities
- **Transaction Management**: Proper rollback and error handling
- **SQL Injection Protection**: All database operations use parameterized procedures
- **Performance Optimization**: Efficient query patterns and connection pooling

### Professional User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern JavaScript**: ES6+ with async/await and error handling
- **User Feedback**: Professional message system (no alert() popups)
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Professional Appearance**: Clean design without emojis or unprofessional elements

### Database Integration
- **Optimized Connection Pool**: 30 concurrent connections with timeout handling
- **Database Reset**: Automated reset functionality via stored procedures
- **Data Validation**: Server-side validation for all inputs
- **Foreign Key Integrity**: Proper CASCADE relationships and constraint enforcement

### Advanced Features Implemented
- **API Wrapper**: Centralized data.js for consistent API interactions
- **Error Handling**: Comprehensive error management with user-friendly messages
- **Search & Filter**: Dynamic content filtering on all management pages
- **Real-time Updates**: Immediate data refresh after operations
- **Form Validation**: Client and server-side validation with helpful feedback

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL with mysql2 driver
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Server**: Deployed on OSU ENGR servers

## What Works - Complete Implementation

### All CRUD Operations Functional
- **Estate Sale Events**: Complete CREATE, READ, UPDATE, DELETE with form validation
- **Customers**: Full customer management with purchase history tracking
- **Items**: Comprehensive item catalog with category management and status tracking
- **Sales**: Complete transaction management with payment processing
- **Sold Items**: Intersection table management with automated updates

### Database Reset Functionality
- **Reset Button**: Available on homepage and all management pages
- **Stored Procedure**: Uses `sp_reset_banana_phone_db()` for complete database reset
- **Performance Optimized**: 30-second timeout with dedicated connections
- **Verification Steps**: 
  1. Visit any management page (e.g., `/customers.html`)
  2. Modify or delete data using available controls
  3. Click "RESET DATABASE" button in the navigation
  4. Verify all original data is restored within seconds

### Advanced READ Operations
- **Dynamic Loading**: All pages load data in real-time from the database
- **Search Functionality**: Filter and search capabilities on all management pages
- **Related Data**: Displays foreign key relationships (e.g., customer names in sales)
- **Statistics**: Real-time dashboard with current counts and summaries
- **Responsive Tables**: Mobile-friendly data display with scroll handling

### Professional CRUD Interface
- **Edit Forms**: Dedicated edit pages for all entities with pre-populated data
- **Add Forms**: New record creation with comprehensive validation
- **Delete Operations**: Safe deletion with confirmation and cascade handling
- **Form Validation**: Real-time client-side and server-side validation
- **Error Handling**: Professional error messages without alert() popups
- **Success Feedback**: Visual confirmation of successful operations

### Database Integration & Security
- **Connection Pooling**: Optimized MySQL2 pool with 30 connections
- **Stored Procedures**: All database operations use parameterized procedures
- **SQL Injection Protection**: No direct SQL in application code
- **Transaction Management**: Proper rollback handling for failed operations
- **Foreign Key Integrity**: Cascade deletes and relationship enforcement

### Production-Ready Features
- **API Wrapper**: Centralized data.js for consistent error handling
- **Modern JavaScript**: ES6+ with async/await patterns
- **Responsive Design**: Mobile-first CSS with professional styling
- **Performance Monitoring**: Request timing and slow query logging
- **Production Scripts**: Forever.js integration for continuous operation

## Project Structure - Complete Implementation

```
project_step_5/
├── server.js                     # Complete Express.js server with full CRUD API
├── db-connector.js              # Optimized MySQL connection pool
├── package.json                 # Node.js dependencies and production scripts
├── DDL.sql                      # Database schema with reset wrapper procedure
├── DML.sql                      # Comprehensive data manipulation queries
├── PL.sql                       # 22+ stored procedures for all CRUD operations
├── reset_database.sql           # Manual database reset for development
├── README.md                    # Complete project documentation
├── .gitignore                   # Repository exclusions (node_modules, credentials)
└── client/
    └── public/
        ├── index.html           # Dashboard with navigation and statistics
        ├── data.js              # API wrapper with error handling
        ├── styles.css           # Professional responsive CSS
        │
        ├── customers.html       # Customer management (full CRUD)
        ├── customers-add.html   # Add new customer form
        ├── edit-customer.html   # Customer edit form with validation
        │
        ├── events.html          # Event management (full CRUD)
        ├── events-add.html      # Add new event form
        ├── edit-event.html      # Event edit form with date validation
        │
        ├── items.html           # Item management (full CRUD)
        ├── items-add.html       # Add new item form
        ├── edit-item.html       # Item edit form with category selection
        │
        ├── sales.html           # Sales management (full CRUD)
        ├── sales-add.html       # Add new sale form with customer lookup
        ├── edit-sale.html       # Sale edit form with payment validation
        │
        └── solditems.html       # Sold items intersection management
```

## API Endpoints - Complete Implementation

### Core CRUD Operations
- `GET /api/events` - Retrieve all estate sale events with filtering
- `GET /api/events/:id` - Get individual event for editing
- `POST /api/events` - Create new estate sale event
- `PUT /api/events/:id` - Update existing event
- `DELETE /api/events/:id` - Delete event (with cascade handling)

- `GET /api/customers` - Retrieve all customers with search capability
- `GET /api/customers/:id` - Get individual customer for editing
- `POST /api/customers` - Create new customer account
- `PUT /api/customers/:id` - Update customer information
- `DELETE /api/customers/:id` - Delete customer (with cascade to sales)

- `GET /api/items` - Retrieve all items with event information and filtering
- `GET /api/items/:id` - Get individual item for editing
- `POST /api/items` - Create new item listing
- `PUT /api/items/:id` - Update item details
- `DELETE /api/items/:id` - Delete item (with sold items handling)

- `GET /api/sales` - Retrieve all sales with customer and payment details
- `GET /api/sales/:id` - Get individual sale for editing
- `POST /api/sales` - Create new sale transaction
- `PUT /api/sales/:id` - Update sale information
- `DELETE /api/sales/:id` - Delete sale (with sold items cleanup)

- `GET /api/solditems` - Retrieve sold items intersection with item/sale details
- `POST /api/solditems` - Add item to sale
- `DELETE /api/solditems/:saleId/:itemId` - Remove item from sale

### Utility Endpoints
- `POST /api/reset` - Complete database reset via `sp_reset_banana_phone_db()`
- `GET /api/customers/dropdown` - Customer list for form dropdowns
- `GET /api/events/dropdown` - Event list for form dropdowns
- `GET /api/statistics` - Dashboard statistics and summary data

### Error Handling
- Comprehensive error responses with detailed messages
- SQL injection protection via stored procedures
- Input validation and sanitization
- Proper HTTP status codes (200, 201, 400, 404, 500)

## Database Reset Verification - Production Ready

To verify the complete RESET functionality:

1. **Navigate to**: http://classwork.engr.oregonstate.edu:6144
2. **Choose any management page**: customers.html, events.html, items.html, sales.html, or solditems.html
3. **Make changes**: Add, edit, or delete records using the available controls
4. **Click RESET**: Use the "RESET DATABASE" button in the navigation header
5. **Verify restoration**: All original data restored within seconds via stored procedure
6. **Performance**: Reset completes in under 45ms with optimized connection handling

## Installation and Deployment - Production Configuration

### Prerequisites
- Node.js 18+ on OSU ENGR servers
- MySQL 8.0+ database access
- Git repository access

### Setup Steps
1. **Clone repository**: `git clone` or upload project files
2. **Install dependencies**: `npm install` (express, mysql2, cors, forever)
3. **Database setup**: Import `DDL.sql` to create schema and reset procedure
4. **Load procedures**: Import `PL.sql` to create all CRUD stored procedures
5. **Configure database**: Update credentials in `db-connector.js` (keep private!)
6. **Start production**: `npm run production` (uses forever for continuous operation)
7. **Verify deployment**: Visit homepage and test all functionality

### Production Features
- **Forever.js integration**: Automatic restart on crashes
- **Connection pooling**: 30 concurrent database connections
- **Error logging**: Comprehensive server-side error tracking
- **Performance monitoring**: Request timing and slow query detection
- **Security**: All database operations via stored procedures

## Project Step 5 - All Requirements Implemented

### 1. Complete Database Web Application
- **Full-stack implementation**: Frontend, backend, and database fully integrated
- **Professional UI**: Responsive design with modern JavaScript patterns
- **Production deployment**: Running on OSU ENGR servers with optimized performance

### 2. All CRUD Operations Functional
- **CREATE**: Add new records for all entities with form validation
- **READ**: Dynamic data display with search and filtering capabilities
- **UPDATE**: Edit existing records with real-time validation
- **DELETE**: Safe deletion with confirmation and cascade handling

### 3. Database Integration via Stored Procedures
- **22+ Stored Procedures**: Complete CRUD operations for all entities
- **SQL Injection Protection**: All database access via parameterized procedures
- **Transaction Management**: Proper error handling and rollback capabilities
- **Performance Optimization**: Connection pooling and query optimization

### 4. Advanced User Interface Features
- **Modern JavaScript**: ES6+ with async/await and error handling
- **API Wrapper**: Centralized data.js for consistent interactions
- **Professional Feedback**: User-friendly messages (no alert() popups)
- **Responsive Design**: Mobile-first CSS with accessibility features
- **Form Validation**: Real-time client and server-side validation

### 5. Production-Ready Implementation
- **Error Handling**: Comprehensive error management at all levels
- **Performance Monitoring**: Request timing and slow query logging
- **Security**: Input validation and SQL injection prevention
- **Deployment**: Forever.js integration for continuous operation
- **Documentation**: Complete README with setup and usage instructions

## Website Features - Complete Implementation

### Homepage Dashboard
- **Company Overview**: Professional presentation with statistics
- **Navigation Hub**: Quick access to all management sections
- **Real-time Statistics**: Current counts and summaries from database
- **Responsive Layout**: Works on all device sizes

### Events Management
- **Browse Events**: Comprehensive event listing with date filtering
- **Add Event**: Create new estate sales with date/time validation
- **Edit Events**: Modify existing events with conflict checking
- **Delete Events**: Safe removal with cascade to related items

### Items Management
- **Item Catalog**: Complete inventory with category and status filters
- **Add Items**: Create new inventory with rich category selection
- **Edit Items**: Update item details with price validation
- **Delete Items**: Remove items with sold items relationship handling

### Customer Management
- **Customer Directory**: Complete customer list with purchase history
- **Add Customers**: Registration with email and phone validation
- **Edit Customers**: Update customer information with duplicate checking
- **Delete Customers**: Safe removal with sales history preservation option

### Sales & Transactions
- **Sales History**: Complete transaction history with payment breakdowns
- **Record Sales**: New transaction creation with customer lookup
- **Edit Sales**: Modify transactions with payment method validation
- **Transaction Management**: Edit sold items within sales

### Sold Items Management
- **Intersection Table**: Manage item-sale relationships
- **Add to Sale**: Associate items with transactions
- **Remove from Sale**: Clean item-sale associations
- **Quantity Management**: Handle multiple quantities of same item

## Technical Implementation - Full Stack

### Frontend Architecture
- **HTML5**: Semantic markup with proper accessibility
- **CSS3**: Mobile-first responsive design with modern styling
- **JavaScript ES6+**: Modern patterns with async/await
- **API Integration**: Centralized data layer with error handling
- **Form Validation**: Real-time validation with helpful feedback

### Backend Implementation  
- **Express.js**: RESTful API with comprehensive endpoint coverage
- **MySQL2**: Optimized connection pooling with 30 concurrent connections
- **Stored Procedures**: All database operations via parameterized procedures
- **Error Handling**: Comprehensive error management with proper HTTP codes
- **Performance**: Request timing and resource monitoring

### Database Design
- **Schema**: Normalized design with proper foreign key relationships
- **Constraints**: CASCADE deletes and referential integrity
- **Stored Procedures**: 22+ procedures for complete CRUD functionality
- **Security**: SQL injection prevention via parameterized procedures
- **Performance**: Optimized queries and connection management
4. **User Authentication:** Login/session management
5. **Error Handling:** Comprehensive error responses

## Authors
- **Cohen Velazquez**
- **Joseph Lucciano Barberan**
- **Group:** 80
- **Course:** CS 340 - Databases
- **Institution:** Oregon State University

## External Dependencies

This project uses the following external libraries (see package.json for versions):

- **express**: Web application framework for Node.js
- **mysql2**: MySQL client for Node.js with Promise support
- **cors**: Cross-Origin Resource Sharing middleware
- **forever**: Tool for ensuring Node.js scripts run continuously in production

## Citations and Attribution

This project represents original work by the authors with assistance from AI generative tools and course materials as detailed below:

### README.md file
- **Created:** 8/7/25, Updated: 8/14/25
- **Content:** All original content and ideas by Cohen Velazquez and Joseph Lucciano Barberan
- **Formatting:** Enhanced with assistance from AI generative tools (GitHub Copilot)

### server.js file
- **Created:** 8/7/25, Updated: 8/14/25  
- **Content:** Original Express.js server implementation by the authors
- **Structure:** Database connection patterns adapted from CS 340 course examples
- **AI Assistance:** Code optimization and error handling patterns enhanced with GitHub Copilot

### db-connector.js file
- **Created:** 8/7/25
- **Source:** Adapted from CS 340 starter code provided in course materials
- **Modifications:** Connection pool settings optimized for project needs by the authors

### client/public/ directory (HTML/CSS/JavaScript files)
- **Created:** 8/7/25 - 8/14/25
- **Content:** Original frontend implementation by the authors
- **Styling:** Custom CSS with responsive design patterns
- **JavaScript:** Original API integration and DOM manipulation
- **AI Assistance:** Code structure and modern JavaScript patterns enhanced with GitHub Copilot

### data.js file  
- **Created:** 8/14/25
- **Content:** Original API wrapper implementation by the authors
- **Patterns:** Modern fetch API usage and error handling
- **AI Assistance:** Code organization and best practices enhanced with GitHub Copilot

### DDL.sql file
- **Created:** 8/7/25, Updated: 8/14/25
- **Content:** Original database schema design by the authors
- **Structure:** Table relationships and constraints designed for project requirements
- **Reset Procedure:** PL/SQL wrapper pattern adapted from course examples (sp_moviedb.sql)

### DML.sql file
- **Created:** 7/31/25, Updated: 8/14/25
- **Content:** Original SQL queries designed by the authors for CRUD operations
- **Patterns:** Parameterized query structure following course best practices

### PL.sql file
- **Created:** 8/14/25
- **Content:** Original stored procedures implemented by the authors
- **Structure:** Transaction handling and error management patterns
- **AI Assistance:** Procedure optimization and SQL best practices enhanced with GitHub Copilot

### CSS Styling (styles.css)
- **Created:** 8/7/25
- **Content:** Original responsive design implementation by the authors
- **Layout:** Custom grid and flexbox layouts
- **Design:** Color scheme and typography choices by the authors

## Academic Integrity Statement

All core functionality, database design, business logic, and creative elements are original work by Cohen Velazquez and Joseph Lucciano Barberan. AI generative tools (GitHub Copilot) were used to enhance code quality, suggest best practices, and improve documentation, but did not generate the fundamental logic or design decisions. All external code sources are properly attributed above.