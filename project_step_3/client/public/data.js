// Sample data for Banana Phone Estate Services
// This simulates the SELECT query results from the database

// Sample data structure based on DML.sql queries
const sampleData = {
    // Events data
    events: [
        {
            eventID: 1,
            title: "Johnson Family Estate Sale",
            startDate: "2024-03-15",
            endDate: "2024-03-17",
            location: "123 Oak Street, Portland, OR",
            description: "Complete household contents including antiques, furniture, and collectibles"
        },
        {
            eventID: 2,
            title: "Modern Art & Vintage Collection",
            startDate: "2024-04-20",
            endDate: "2024-04-22",
            location: "456 Pine Avenue, Eugene, OR",
            description: "Contemporary art pieces and vintage mid-century furniture"
        },
        {
            eventID: 3,
            title: "Coin & Jewelry Estate Sale",
            startDate: "2024-05-10",
            endDate: "2024-05-12",
            location: "789 Elm Drive, Salem, OR",
            description: "Rare coins, precious jewelry, and luxury accessories"
        }
    ],

    // Items data
    items: [
        {
            itemID: 1,
            eventID: 1,
            name: "Antique Oak Dining Table",
            category: "Furniture",
            description: "Beautiful 1920s oak dining table with 6 matching chairs",
            startingPrice: 450.00,
            status: "Available"
        },
        {
            itemID: 2,
            eventID: 1,
            name: "Royal Doulton China Set",
            category: "Dishware",
            description: "Complete 12-piece Royal Doulton china service",
            startingPrice: 275.00,
            status: "Sold"
        },
        {
            itemID: 3,
            eventID: 1,
            name: "Victorian Jewelry Box",
            category: "Accessories",
            description: "Ornate Victorian jewelry box with velvet interior",
            startingPrice: 125.00,
            status: "Sold"
        },
        {
            itemID: 4,
            eventID: 2,
            name: "Mid-Century Modern Sofa",
            category: "Furniture",
            description: "Pristine condition 1960s sectional sofa",
            startingPrice: 800.00,
            status: "Hold"
        },
        {
            itemID: 5,
            eventID: 2,
            name: "Abstract Oil Painting",
            category: "Art",
            description: "Original abstract oil painting by local artist",
            startingPrice: 150.00,
            status: "Available"
        },
        {
            itemID: 6,
            eventID: 2,
            name: "Atomic Clock",
            category: "Decor",
            description: "1950s atomic sunburst wall clock",
            startingPrice: 85.00,
            status: "Sold"
        },
        {
            itemID: 7,
            eventID: 2,
            name: "Boomerang Coffee Table",
            category: "Furniture",
            description: "Iconic mid-century boomerang-shaped coffee table",
            startingPrice: 320.00,
            status: "Sold"
        },
        {
            itemID: 8,
            eventID: 3,
            name: "Gold Wedding Ring Set",
            category: "Jewelry",
            description: "14k gold wedding ring set with diamonds",
            startingPrice: 650.00,
            status: "Available"
        },
        {
            itemID: 9,
            eventID: 3,
            name: "1964 Kennedy Half Dollar",
            category: "Collectibles",
            description: "Rare 1964 Kennedy half dollar in excellent condition",
            startingPrice: 25.00,
            status: "Sold"
        },
        {
            itemID: 10,
            eventID: 3,
            name: "Pearl Necklace",
            category: "Jewelry",
            description: "Genuine cultured pearl necklace with gold clasp",
            startingPrice: 180.00,
            status: "Available"
        }
    ],

    // Customers data
    customers: [
        {
            customerID: 1,
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah.johnson@email.com",
            phone: "(503) 555-0123",
            created_at: "2024-03-14"
        },
        {
            customerID: 2,
            firstName: "Michael",
            lastName: "Chen",
            email: "michael.chen@email.com",
            phone: "(503) 555-0456",
            created_at: "2024-04-19"
        },
        {
            customerID: 3,
            firstName: "Emily",
            lastName: "Rodriguez",
            email: "emily.rodriguez@email.com",
            phone: "(503) 555-0789",
            created_at: "2024-05-09"
        },
        {
            customerID: 4,
            firstName: "David",
            lastName: "Thompson",
            email: "david.thompson@email.com",
            phone: "(503) 555-0321",
            created_at: "2024-04-20"
        },
        {
            customerID: 5,
            firstName: "Lisa",
            lastName: "Martinez",
            email: "lisa.martinez@email.com",
            phone: "(503) 555-0654",
            created_at: "2024-03-16"
        }
    ],

    // Sales data
    sales: [
        {
            saleID: 1,
            customerID: 1,
            eventID: 1,
            saleDate: "2024-03-16",
            totalAmount: 400.00,
            paymentMethod: "Credit Card"
        },
        {
            saleID: 2,
            customerID: 2,
            eventID: 2,
            saleDate: "2024-04-21",
            totalAmount: 85.00,
            paymentMethod: "Cash"
        },
        {
            saleID: 3,
            customerID: 3,
            eventID: 3,
            saleDate: "2024-05-11",
            totalAmount: 25.00,
            paymentMethod: "Check"
        },
        {
            saleID: 4,
            customerID: 1,
            eventID: 1,
            saleDate: "2024-03-17",
            totalAmount: 125.00,
            paymentMethod: "Credit Card"
        },
        {
            saleID: 5,
            customerID: 4,
            eventID: 2,
            saleDate: "2024-04-22",
            totalAmount: 320.00,
            paymentMethod: "Cash"
        }
    ],

    // SoldItems data (intersection table)
    soldItems: [
        {
            saleID: 1,
            itemID: 2,
            unitPrice: 275.00,
            quantity: 1
        },
        {
            saleID: 2,
            itemID: 6,
            unitPrice: 85.00,
            quantity: 1
        },
        {
            saleID: 3,
            itemID: 9,
            unitPrice: 25.00,
            quantity: 1
        },
        {
            saleID: 4,
            itemID: 3,
            unitPrice: 125.00,
            quantity: 1
        },
        {
            saleID: 5,
            itemID: 7,
            unitPrice: 320.00,
            quantity: 1
        }
    ]
};

// Query functions that simulate the DML.sql SELECT statements

// Browse/Display all SoldItems with complete information
function getAllSoldItems() {
    return sampleData.soldItems.map(si => {
        const item = sampleData.items.find(i => i.itemID === si.itemID);
        const sale = sampleData.sales.find(s => s.saleID === si.saleID);
        const customer = sampleData.customers.find(c => c.customerID === sale.customerID);
        const event = sampleData.events.find(e => e.eventID === sale.eventID);
        
        return {
            saleID: si.saleID,
            itemID: si.itemID,
            unitPrice: si.unitPrice,
            quantity: si.quantity,
            lineTotal: si.unitPrice * si.quantity,
            itemName: item.name,
            itemCategory: item.category,
            customerName: `${customer.firstName} ${customer.lastName}`,
            eventTitle: event.title,
            saleDate: sale.saleDate
        };
    });
}

// Get SoldItems for a specific Sale
function getSoldItemsBySale(saleId) {
    return getAllSoldItems().filter(si => si.saleID === parseInt(saleId));
}

// Get all Items with Event information
function getAllItems() {
    return sampleData.items.map(item => {
        const event = sampleData.events.find(e => e.eventID === item.eventID);
        return {
            ...item,
            eventTitle: event.title
        };
    });
}

// Get all Events
function getAllEvents() {
    return sampleData.events;
}

// Get all Customers with purchase summary
function getAllCustomers() {
    return sampleData.customers.map(customer => {
        const customerSales = sampleData.sales.filter(s => s.customerID === customer.customerID);
        const totalPurchases = customerSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        
        return {
            ...customer,
            totalPurchases: totalPurchases,
            numberOfSales: customerSales.length
        };
    });
}

// Get all Sales with customer and event information
function getAllSales() {
    return sampleData.sales.map(sale => {
        const customer = sampleData.customers.find(c => c.customerID === sale.customerID);
        const event = sampleData.events.find(e => e.eventID === sale.eventID);
        
        return {
            ...sale,
            customerName: `${customer.firstName} ${customer.lastName}`,
            eventTitle: event.title
        };
    });
}

// Make functions available globally
window.sampleData = sampleData;
window.getAllSoldItems = getAllSoldItems;
window.getSoldItemsBySale = getSoldItemsBySale;
window.getAllItems = getAllItems;
window.getAllEvents = getAllEvents;
window.getAllCustomers = getAllCustomers;
window.getAllSales = getAllSales;
