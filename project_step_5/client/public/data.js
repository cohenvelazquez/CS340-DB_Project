// Banana Phone Estate Services - Frontend Data Management and API Functions
// Authors: Cohen Velazquez and Joseph Lucciano Barberan
// Group: 80
// Date: August 14, 2025
// Citation: API structure adapted from course examples and modern fetch patterns

// ====================================================================
// API CONFIGURATION
// ====================================================================

const API_BASE = '/api';

// Helper function to handle API responses
async function handleResponse(response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
}

// Helper function to show user feedback
function showMessage(message, type = 'info') {
    // Create or update a message display element
    let messageDiv = document.getElementById('message-display');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'message-display';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            border-radius: 5px;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(messageDiv);
    }
    
    messageDiv.textContent = message;
    messageDiv.className = `message-${type}`;
    
    // Style based on type
    const styles = {
        success: { backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' },
        error: { backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' },
        info: { backgroundColor: '#d1ecf1', color: '#0c5460', border: '1px solid #bee5eb' }
    };
    
    Object.assign(messageDiv.style, styles[type] || styles.info);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// ====================================================================
// ESTATE SALE EVENTS - API FUNCTIONS
// ====================================================================

const eventsAPI = {
    // Get all events
    async getAll() {
        try {
            const response = await fetch(`${API_BASE}/events`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching events:', error);
            throw error;
        }
    },

    // Get single event by ID
    async getById(id) {
        try {
            const response = await fetch(`${API_BASE}/events/${id}`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching event:', error);
            throw error;
        }
    },

    // Create new event
    async create(eventData) {
        try {
            const response = await fetch(`${API_BASE}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });
            const result = await handleResponse(response);
            showMessage('Event created successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Error creating event:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Update event
    async update(id, eventData) {
        try {
            const response = await fetch(`${API_BASE}/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });
            const result = await handleResponse(response);
            showMessage('Event updated successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Error updating event:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Delete event
    async delete(id) {
        try {
            const response = await fetch(`${API_BASE}/events/${id}`, {
                method: 'DELETE'
            });
            const result = await handleResponse(response);
            showMessage(result.message, 'success');
            return result;
        } catch (error) {
            console.error('Error deleting event:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Get events for dropdown
    async getForDropdown() {
        try {
            const response = await fetch(`${API_BASE}/events/dropdown`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching events for dropdown:', error);
            throw error;
        }
    }
};

// ====================================================================
// CUSTOMERS - API FUNCTIONS
// ====================================================================

const customersAPI = {
    // Get all customers
    async getAll() {
        try {
            const response = await fetch(`${API_BASE}/customers`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    },

    // Get single customer by ID
    async getById(id) {
        try {
            const response = await fetch(`${API_BASE}/customers/${id}`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching customer:', error);
            throw error;
        }
    },

    // Create new customer
    async create(customerData) {
        try {
            const response = await fetch(`${API_BASE}/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData)
            });
            const result = await handleResponse(response);
            showMessage('Customer created successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Error creating customer:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Update customer
    async update(id, customerData) {
        try {
            const response = await fetch(`${API_BASE}/customers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData)
            });
            const result = await handleResponse(response);
            showMessage('Customer updated successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Error updating customer:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Delete customer
    async delete(id) {
        try {
            const response = await fetch(`${API_BASE}/customers/${id}`, {
                method: 'DELETE'
            });
            const result = await handleResponse(response);
            showMessage(result.message, 'success');
            return result;
        } catch (error) {
            console.error('Error deleting customer:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Get customers for dropdown
    async getForDropdown() {
        try {
            const response = await fetch(`${API_BASE}/customers/dropdown`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching customers for dropdown:', error);
            throw error;
        }
    }
};

// ====================================================================
// ITEMS - API FUNCTIONS
// ====================================================================

const itemsAPI = {
    // Get all items
    async getAll() {
        try {
            const response = await fetch(`${API_BASE}/items`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    },

    // Get single item by ID
    async getById(id) {
        try {
            const response = await fetch(`${API_BASE}/items/${id}`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching item:', error);
            throw error;
        }
    },

    // Create new item
    async create(itemData) {
        try {
            const response = await fetch(`${API_BASE}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData)
            });
            const result = await handleResponse(response);
            showMessage('Item created successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Error creating item:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Update item
    async update(id, itemData) {
        try {
            const response = await fetch(`${API_BASE}/items/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemData)
            });
            const result = await handleResponse(response);
            showMessage('Item updated successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Error updating item:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Delete item
    async delete(id) {
        try {
            const response = await fetch(`${API_BASE}/items/${id}`, {
                method: 'DELETE'
            });
            const result = await handleResponse(response);
            showMessage(result.message, 'success');
            return result;
        } catch (error) {
            console.error('Error deleting item:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Get available items for sale
    async getAvailable() {
        try {
            const response = await fetch(`${API_BASE}/items/available`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching available items:', error);
            throw error;
        }
    }
};

// ====================================================================
// SALES - API FUNCTIONS
// ====================================================================

const salesAPI = {
    // Get all sales
    async getAll() {
        try {
            const response = await fetch(`${API_BASE}/sales`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching sales:', error);
            throw error;
        }
    },

    // Get single sale by ID
    async getById(id) {
        try {
            const response = await fetch(`${API_BASE}/sales/${id}`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching sale:', error);
            throw error;
        }
    },

    // Create new sale
    async create(saleData) {
        try {
            const response = await fetch(`${API_BASE}/sales`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saleData)
            });
            const result = await handleResponse(response);
            showMessage('Sale created successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Error creating sale:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Update sale
    async update(id, saleData) {
        try {
            const response = await fetch(`${API_BASE}/sales/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saleData)
            });
            const result = await handleResponse(response);
            showMessage('Sale updated successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Error updating sale:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Delete sale
    async delete(id) {
        try {
            const response = await fetch(`${API_BASE}/sales/${id}`, {
                method: 'DELETE'
            });
            const result = await handleResponse(response);
            showMessage(result.message, 'success');
            return result;
        } catch (error) {
            console.error('Error deleting sale:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Get items for a specific sale
    async getItems(saleId) {
        try {
            const response = await fetch(`${API_BASE}/sales/${saleId}/items`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching sale items:', error);
            throw error;
        }
    }
};

// ====================================================================
// SOLD ITEMS - API FUNCTIONS
// ====================================================================

const soldItemsAPI = {
    // Get all sold items
    async getAll() {
        try {
            const response = await fetch(`${API_BASE}/solditems`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching sold items:', error);
            throw error;
        }
    },

    // Add item to sale
    async create(soldItemData) {
        try {
            const response = await fetch(`${API_BASE}/solditems`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(soldItemData)
            });
            const result = await handleResponse(response);
            showMessage('Item added to sale successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Error adding item to sale:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Update sold item
    async update(saleId, itemId, soldItemData) {
        try {
            const response = await fetch(`${API_BASE}/solditems/${saleId}/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(soldItemData)
            });
            const result = await handleResponse(response);
            showMessage('Sold item updated successfully!', 'success');
            return result;
        } catch (error) {
            console.error('Error updating sold item:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Remove item from sale
    async delete(saleId, itemId) {
        try {
            const response = await fetch(`${API_BASE}/solditems/${saleId}/${itemId}`, {
                method: 'DELETE'
            });
            const result = await handleResponse(response);
            showMessage(result.message, 'success');
            return result;
        } catch (error) {
            console.error('Error removing item from sale:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    }
};

// ====================================================================
// DATABASE MANAGEMENT - API FUNCTIONS
// ====================================================================

const databaseAPI = {
    // Reset database
    async reset() {
        try {
            const response = await fetch(`${API_BASE}/reset`, {
                method: 'POST'
            });
            const result = await handleResponse(response);
            showMessage(result.message, 'success');
            return result;
        } catch (error) {
            console.error('Error resetting database:', error);
            showMessage(error.message, 'error');
            throw error;
        }
    },

    // Get debug information
    async getDebugInfo() {
        try {
            const response = await fetch(`${API_BASE}/debug/tables`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error fetching debug info:', error);
            throw error;
        }
    }
};

// ====================================================================
// UTILITY FUNCTIONS FOR FORMS AND DATA DISPLAY
// ====================================================================

// Format date for HTML datetime-local input
function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
}

// Format date for display
function formatDateForDisplay(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Populate dropdown with options
async function populateDropdown(selectElement, apiFunction, valueField, textField) {
    try {
        const data = await apiFunction();
        selectElement.innerHTML = '<option value="">Select...</option>';
        
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating dropdown:', error);
        selectElement.innerHTML = '<option value="">Error loading options</option>';
    }
}

// Generic function to populate a table with data
function populateTable(tableId, data, columns) {
    console.log('populateTable called with:', {tableId, dataLength: data?.length, columns: columns?.length});
    
    const table = document.getElementById(tableId);
    if (!table) {
        console.error('Table element not found:', tableId);
        return;
    }

    const tbody = table.querySelector('tbody');
    if (!tbody) {
        console.error('Table tbody not found in table:', tableId);
        return;
    }
    
    tbody.innerHTML = '';

    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        
        columns.forEach((column, colIndex) => {
            const td = document.createElement('td');
            
            if (column.formatter) {
                td.innerHTML = column.formatter(row[column.field], row);
            } else {
                td.textContent = row[column.field] || '';
            }
            
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
    
    console.log('populateTable completed. Rows added:', data.length);
}

// ====================================================================
// EXPORT ALL API OBJECTS FOR GLOBAL ACCESS
// ====================================================================

// Make APIs available globally
window.eventsAPI = eventsAPI;
window.customersAPI = customersAPI;
window.itemsAPI = itemsAPI;
window.salesAPI = salesAPI;
window.soldItemsAPI = soldItemsAPI;
window.databaseAPI = databaseAPI;

// Make utility functions available globally
window.formatDateForInput = formatDateForInput;
window.formatDateForDisplay = formatDateForDisplay;
window.formatCurrency = formatCurrency;
window.populateDropdown = populateDropdown;
window.populateTable = populateTable;
window.showMessage = showMessage;

// Global convenience functions for common operations
window.resetDatabase = async () => {
    // Find all reset buttons and disable them
    const resetButtons = document.querySelectorAll('#resetBtn, .reset-btn');
    resetButtons.forEach(btn => {
        btn.disabled = true;
        btn.textContent = 'RESETTING...';
    });

    try {
        const result = await databaseAPI.reset();
        
        // Reload current page data if possible
        if (typeof loadData === 'function') {
            await loadData();
        } else if (typeof loadItems === 'function') {
            await loadItems();
        } else if (typeof loadCustomers === 'function') {
            await loadCustomers();
        } else if (typeof loadEvents === 'function') {
            await loadEvents();
        } else if (typeof loadSales === 'function') {
            await loadSales();
        } else if (typeof loadSoldItems === 'function') {
            await loadSoldItems();
        }
        
        return result;
    } catch (error) {
        console.error('Reset failed:', error);
        throw error;
    } finally {
        // Re-enable reset buttons
        resetButtons.forEach(btn => {
            btn.disabled = false;
            btn.textContent = 'RESET DATABASE';
        });
    }
};
