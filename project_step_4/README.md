# Project Step 4 - Banana Phone Estate Services Web Application

## Website URL
**http://classwork.engr.oregonstate.edu:6144**

## Project Overview

This is the Project Step 4 implementation of the Banana Phone Estate Services Estate Sale Management System. This step focuses on implementing basic web functionality with database connectivity, including a RESET feature and READ operations for all entities.

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MySQL with mysql2 driver
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Server**: Deployed on OSU ENGR servers

## What Works

### Database Reset Functionality
- **RESET Button**: Present on the homepage (index.html) and customer management page
- **How to verify RESET works**: 
  1. Visit the customer management page (`/customers.html`)
  2. Note the current list of customers
  3. Delete a customer using the "Delete" button
  4. Click "RESET DATABASE" button
  5. Observe that all original customers are restored

### READ Operations (SELECT queries)
- **Events Page**: Displays all estate sale events from the database
- **Customers Page**: Shows all customers with real-time data loading
- **Items Page**: Lists all items with their associated events
- **Sales Page**: Displays sales transactions with customer information
- **Sold Items Page**: Shows the intersection table data with related information

### One CUD Operation for Demo
- **Delete Customer**: Implemented on the customers page to demonstrate database changes
- Uses the `sp_delete_customer` stored procedure
- Includes proper error handling and confirmation dialogs

### Dynamic Data Loading
- All pages load data dynamically from the database via API endpoints
- Real-time statistics on the homepage
- Search functionality on customer management

## What Doesn't Work (Not Required for Step 4)

- **INSERT operations**: Forms exist but submit functionality not yet implemented
- **UPDATE operations**: Edit pages exist but are not yet functional
- **Complex CRUD operations**: Will be implemented in future steps

## Project Structure

```
project_step_4/
├── server.js                     # Express.js server with database connectivity
├── package.json                  # Node.js dependencies
├── DDL.sql                      # Data Definition with PL/SQL reset wrapper
├── DML.sql                      # Data Manipulation Queries
├── PL.sql                       # Additional PL/SQL procedures
├── README.md                    # This file
└── client/
    └── public/
        ├── index.html           # Homepage with RESET button
        ├── customers.html       # Customer management with DELETE demo
        ├── events.html          # Event browsing (READ operation)
        ├── items.html           # Item management (READ operation)
        ├── sales.html           # Sales browsing (READ operation)
        ├── solditems.html       # Sold items intersection (READ operation)
        └── styles.css           # Global stylesheet
```

## API Endpoints

- `POST /api/reset` - Calls `sp_reset_banana_phone_db()` stored procedure
- `GET /api/events` - Retrieves all estate sale events
- `GET /api/customers` - Retrieves all customers
- `GET /api/items` - Retrieves all items with event information
- `GET /api/sales` - Retrieves all sales with customer information
- `GET /api/solditems` - Retrieves sold items intersection table
- `DELETE /api/customers/:id` - Deletes a customer (demo CUD operation)

## Database Reset Verification

To verify the RESET functionality works:

1. **Navigate to**: http://classwork.engr.oregonstate.edu:6144/customers.html
2. **Before Reset**: Note the customers listed (Sarah Johnson, Michael Chen, etc.)
3. **Make a Change**: Delete one customer using the red "Delete" button
4. **Click RESET**: Use the red "RESET DATABASE" button in the header
5. **Verify**: All original customers should be restored

## Installation and Deployment

### Prerequisites
- Node.js installed on ENGR servers
- MySQL database access with proper credentials

### Setup Steps
1. Upload files to ENGR server directory
2. Update database credentials in `server.js`
3. Install dependencies: `npm install`
4. Start server: `npm start`
5. Import `DDL.sql` into phpMyAdmin to create the reset procedure

## Authors
- **Cohen Velazquez**
- **Joseph Lucciano Barberan**
- **Group**: 80
- **Course**: CS 340 - Databases
- **Oregon State University**

## Citations and AI Usage

- **Database connection structure**: Adapted from course examples and MySQL2 documentation
- **PL/SQL wrapper**: Based on sp_moviedb.sql example provided in course materials
- **AI Tools**: GitHub Copilot was used to help structure API endpoints and error handling
- **Course Materials**: Various examples from CS 340 course content were referenced

## Future Implementation (Next Steps)

- Complete INSERT, UPDATE, DELETE operations for all entities
- Implement form submission handling
- Add more sophisticated error handling and validation
- Enhance user interface with better feedback
- Add transaction management for complex operations

### 1. PDF File
- Convert `Project_Step_3_Report.md` to PDF
- Includes all previous step content plus new web app details
- Contains website URL at top of first page

### 2. Website URL
- **Main URL:** http://classwork.engr.oregonstate.edu:6144
- Index page with navigation to all UI pages
- Complete frontend implementation

### 3. DML.sql File
- Data Manipulation Queries for all CRUD operations
- Uses `@variableName` notation for backend variables
- Includes SELECT, INSERT, UPDATE, DELETE for all entities
- Contains reporting and summary queries

### 4. DDL.sql File
- Updated Data Definition Language from Step 2
- Table creation with foreign key constraints
- Sample data INSERT statements
- Proper CASCADE options

## Website Features

### Homepage
- Company overview and statistics
- Navigation grid to all major sections
- Professional design with responsive layout

### Events Management
- **Browse Events:** View all estate sale events with filtering
- **Add Event:** Create new events with date/time validation

### Items Management
- **Browse Items:** Comprehensive catalog with status indicators
- **Add Item:** Create new items with category selection

### Customer Management
- **Browse Customers:** Customer list with purchase history
- **Add Customer:** Registration form with validation

### Sales & Transactions
- **Browse Sales:** Transaction history with payment breakdowns
- **Record Sale:** New transaction form
- **Sold Items:** Intersection table management

## Technical Implementation

### Frontend
- **HTML5:** Semantic markup with accessibility features
- **CSS3:** Responsive design with modern styling
- **JavaScript:** Client-side validation and interactions

### Backend (Basic)
- **Express.js:** Web server framework
- **Static File Serving:** Serves HTML/CSS/JS files
- **API Endpoints:** Placeholder routes for future implementation

### Database Integration (Future)
- **MySQL Connection:** Will be implemented in later steps
- **Query Execution:** DML queries ready for integration
- **Error Handling:** Planned for backend implementation

## Next Steps (Future Project Steps)

1. **Database Connectivity:** Connect Express.js to MySQL
2. **API Implementation:** Execute DML queries via backend
3. **Real-time Updates:** Dynamic data loading
4. **User Authentication:** Login/session management
5. **Error Handling:** Comprehensive error responses

## Authors
- **Cohen Velazquez**
- **Joseph Lucciano Barberan**
- **Group:** 80
- **Course:** CS 340 - Databases
- **Institution:** Oregon State University
