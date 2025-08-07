-- Banana Phone Estate Services Sales Management System
-- PL/SQL Stored Procedures and Functions
-- Authors: Cohen Velazquez and Joseph Lucciano Barberan
-- Group: 80
-- Date: August 7, 2025

-- Citation: For Step 4, we are only implementing one CUD operation for demonstration.
-- Additional CUD operations will be implemented in future project steps.

-- Simple DELETE operation for demonstrating RESET functionality
-- This procedure deletes a customer and all associated sales (CASCADE will handle related records)
DROP PROCEDURE IF EXISTS sp_delete_customer;

DELIMITER //
CREATE PROCEDURE sp_delete_customer(IN customer_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Delete the customer (CASCADE will handle related sales and sold items)
    DELETE FROM Customers WHERE customerID = customer_id;
    
    COMMIT;
END //
DELIMITER ;

-- Additional stored procedures for CUD operations will be added in future steps
-- This file serves as a placeholder for PL/SQL code that will be expanded upon
-- in subsequent project deliverables.
