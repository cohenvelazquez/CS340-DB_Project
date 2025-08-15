-- Banana Phone Estate Services Sales Management System
-- PL/SQL Stored Procedures and Functions
-- Authors: Cohen Velazquez and Joseph Lucciano Barberan
-- Group: 80
-- Date: August 14, 2025

-- Citation: Stored procedures implement comprehensive CRUD operations with proper
-- error handling and transaction management to prevent SQL injection attacks.

-- =============================================================================
-- DELETE PROCEDURES FOR ALL ENTITIES
-- =============================================================================

-- Delete Customer and all associated sales (CASCADE will handle related records)
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
    DELETE FROM Customers WHERE customerID = customer_id;
    COMMIT;
END //
DELIMITER ;

-- Delete Estate Sale Event and all associated items
DROP PROCEDURE IF EXISTS sp_delete_estate_sale_event;

DELIMITER //
CREATE PROCEDURE sp_delete_estate_sale_event(IN event_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Delete the estate sale event (CASCADE will handle related items and sold items)
    DELETE FROM EstateSaleEvents WHERE eventID = event_id;
    
    COMMIT;
END //
DELIMITER ;

-- Delete Item and all associated sold items
DROP PROCEDURE IF EXISTS sp_delete_item;

DELIMITER //
CREATE PROCEDURE sp_delete_item(IN item_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Delete the item (CASCADE will handle related sold items)
    DELETE FROM Items WHERE itemID = item_id;
    
    COMMIT;
END //
DELIMITER ;

-- Delete Sale and all associated sold items
DROP PROCEDURE IF EXISTS sp_delete_sale;

DELIMITER //
CREATE PROCEDURE sp_delete_sale(IN sale_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Update item status back to Available for all items in this sale
    UPDATE Items i
    JOIN SoldItems si ON i.itemID = si.itemID
    SET i.status = 'Available'
    WHERE si.saleID = sale_id;
    
    -- Delete the sale (CASCADE will handle related sold items)
    DELETE FROM Sales WHERE saleID = sale_id;
    
    COMMIT;
END //
DELIMITER ;

-- Delete Sold Item (junction table record) and update sale total
DROP PROCEDURE IF EXISTS sp_delete_sold_item;

DELIMITER //
CREATE PROCEDURE sp_delete_sold_item(IN sale_id INT, IN item_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Delete the sold item record
    DELETE FROM SoldItems WHERE saleID = sale_id AND itemID = item_id;
    
    -- Update item status back to Available
    UPDATE Items SET status = 'Available' WHERE itemID = item_id;
    
    -- Update sale total amount to reflect the removal
    UPDATE Sales 
    SET totalAmount = COALESCE((
        SELECT SUM(si.unitPrice * si.quantity) 
        FROM SoldItems si 
        WHERE si.saleID = sale_id
    ), 0)
    WHERE saleID = sale_id;
    
    COMMIT;
END //
DELIMITER ;

-- =============================================================================
-- BULK DELETE PROCEDURES
-- =============================================================================

-- Delete all sold items for a specific sale
DROP PROCEDURE IF EXISTS sp_delete_all_sold_items_for_sale;

DELIMITER //
CREATE PROCEDURE sp_delete_all_sold_items_for_sale(IN sale_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Delete all sold items for the specified sale
    DELETE FROM SoldItems WHERE saleID = sale_id;
    
    COMMIT;
END //
DELIMITER ;

-- Delete all items for a specific estate sale event
DROP PROCEDURE IF EXISTS sp_delete_all_items_for_event;

DELIMITER //
CREATE PROCEDURE sp_delete_all_items_for_event(IN event_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Delete all items for the specified event (CASCADE will handle sold items)
    DELETE FROM Items WHERE eventID = event_id;
    
    COMMIT;
END //
DELIMITER ;
