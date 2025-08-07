// Sample data for Banana Phone Estate Services
// This simulates the SELECT query results from the database
// Updated to match DDL.sql sample data - July 31, 2025

// Sample data structure based on DML.sql queries
const sampleData = {
    // EstateSaleEvents data
    events: [
        {
            eventID: 1,
            title: "Victorian Manor Estate Sale",
            startDate: "2025-08-01",
            endDate: "2025-08-03",
            location: "1234 Oak Street, Portland, OR 97201",
            description: "Beautiful Victorian home with antique furniture, china, and collectibles"
        },
        {
            eventID: 2,
            title: "Mid-Century Modern Collection",
            startDate: "2025-08-15",
            endDate: "2025-08-17",
            location: "5678 Pine Avenue, Beaverton, OR 97005",
            description: "Stunning collection of 1950s-60s furniture and decor"
        },
        {
            eventID: 3,
            title: "Collector's Paradise Sale",
            startDate: "2025-09-01",
            endDate: "2025-09-02",
            location: "9012 Maple Drive, Lake Oswego, OR 97034",
            description: "Rare books, coins, stamps, and vintage toys"
        },
        {
            eventID: 4,
            title: "Garden Estate Sale",
            startDate: "2025-09-15",
            endDate: "2025-09-16",
            location: "3456 Elm Street, Tigard, OR 97223",
            description: "Beautiful home with extensive garden tools and outdoor furniture"
        },
        {
            eventID: 5,
            title: "Art Lover's Estate",
            startDate: "2025-10-01",
            endDate: "2025-10-03",
            location: "7890 Cedar Lane, Milwaukie, OR 97222",
            description: "Original paintings, sculptures, and art supplies"
        }
    ],

    // Items data
    items: [
        // Items for Victorian Manor Estate Sale (eventID = 1)
        {
            itemID: 1,
            eventID: 1,
            name: "Mahogany Dining Table",
            category: "Furniture",
            description: "Antique mahogany dining table seats 8, circa 1890",
            startingPrice: 450.00,
            status: "Available"
        },
        {
            itemID: 2,
            eventID: 1,
            name: "Royal Doulton China Set",
            category: "China",
            description: "Complete 12-place setting with serving pieces",
            startingPrice: 275.00,
            status: "Sold"
        },
        {
            itemID: 3,
            eventID: 1,
            name: "Victorian Jewelry Box",
            category: "Collectibles",
            description: "Hand-carved wooden jewelry box with velvet interior",
            startingPrice: 125.00,
            status: "Available"
        },
        {
            itemID: 4,
            eventID: 1,
            name: "Persian Rug",
            category: "Home Decor",
            description: "Hand-woven Persian rug 8x10 feet, excellent condition",
            startingPrice: 800.00,
            status: "Held"
        },
        // Items for Mid-Century Modern Collection (eventID = 2)
        {
            itemID: 5,
            eventID: 2,
            name: "Eames Lounge Chair",
            category: "Furniture",
            description: "Authentic Herman Miller Eames chair and ottoman",
            startingPrice: 1200.00,
            status: "Available"
        },
        {
            itemID: 6,
            eventID: 2,
            name: "Atomic Clock",
            category: "Decor",
            description: "Sunburst atomic wall clock from the 1960s",
            startingPrice: 85.00,
            status: "Sold"
        },
        {
            itemID: 7,
            eventID: 2,
            name: "Boomerang Coffee Table",
            category: "Furniture",
            description: "Kidney-shaped coffee table with hairpin legs",
            startingPrice: 320.00,
            status: "Available"
        },
        // Items for Collector's Paradise Sale (eventID = 3)
        {
            itemID: 8,
            eventID: 3,
            name: "First Edition Hemingway",
            category: "Books",
            description: "The Old Man and the Sea, first edition 1952",
            startingPrice: 500.00,
            status: "Available"
        },
        {
            itemID: 9,
            eventID: 3,
            name: "1964 Kennedy Half Dollar",
            category: "Coins",
            description: "Uncirculated condition silver half dollar",
            startingPrice: 25.00,
            status: "Sold"
        },
        {
            itemID: 10,
            eventID: 3,
            name: "Lionel Train Set",
            category: "Toys",
            description: "Complete O-gauge train set with accessories",
            startingPrice: 350.00,
            status: "Available"
        },
        // Items for Garden Estate Sale (eventID = 4)
        {
            itemID: 11,
            eventID: 4,
            name: "Teak Patio Set",
            category: "Outdoor",
            description: "6-piece teak patio furniture set with cushions",
            startingPrice: 650.00,
            status: "Available"
        },
        {
            itemID: 12,
            eventID: 4,
            name: "Vintage Garden Tools",
            category: "Tools",
            description: "Collection of well-maintained vintage garden tools",
            startingPrice: 75.00,
            status: "Available"
        },
        // Items for Art Lover's Estate (eventID = 5)
        {
            itemID: 13,
            eventID: 5,
            name: "Oil Painting Landscape",
            category: "Art",
            description: "Original oil painting by local artist, framed",
            startingPrice: 225.00,
            status: "Available"
        },
        {
            itemID: 14,
            eventID: 5,
            name: "Bronze Sculpture",
            category: "Art",
            description: "Small bronze sculpture of a dancer, signed",
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
            phone: "503-555-0101",
            created_at: "2025-07-30"
        },
        {
            customerID: 2,
            firstName: "Michael",
            lastName: "Chen",
            email: "mchen@email.com",
            phone: "503-555-0102",
            created_at: "2025-07-30"
        },
        {
            customerID: 3,
            firstName: "Emily",
            lastName: "Rodriguez",
            email: "emily.r@email.com",
            phone: "503-555-0103",
            created_at: "2025-07-30"
        },
        {
            customerID: 4,
            firstName: "David",
            lastName: "Thompson",
            email: "dthompson@email.com",
            phone: "503-555-0104",
            created_at: "2025-07-30"
        },
        {
            customerID: 5,
            firstName: "Lisa",
            lastName: "Anderson",
            email: "lisa.anderson@email.com",
            phone: "503-555-0105",
            created_at: "2025-07-30"
        }
    ],

    // Sales data (normalized - no eventID due to 3NF compliance)
    sales: [
        {
            saleID: 1,
            customerID: 1,
            saleDate: "2025-08-01",
            totalAmount: 275.00,
            paymentMethod: "Credit Card"
        },
        {
            saleID: 2,
            customerID: 2,
            saleDate: "2025-08-15",
            totalAmount: 85.00,
            paymentMethod: "Cash"
        },
        {
            saleID: 3,
            customerID: 3,
            saleDate: "2025-09-01",
            totalAmount: 25.00,
            paymentMethod: "Cash"
        },
        {
            saleID: 4,
            customerID: 1,
            saleDate: "2025-08-02",
            totalAmount: 125.00,
            paymentMethod: "Credit Card"
        },
        {
            saleID: 5,
            customerID: 4,
            saleDate: "2025-08-16",
            totalAmount: 320.00,
            paymentMethod: "Check"
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
        const event = sampleData.events.find(e => e.eventID === item.eventID);
        
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

// Get all Sales with customer and event information (normalized approach)
function getAllSales() {
    return sampleData.sales.map(sale => {
        const customer = sampleData.customers.find(c => c.customerID === sale.customerID);
        
        // Get event information through soldItems -> items -> events
        const saleItems = sampleData.soldItems.filter(si => si.saleID === sale.saleID);
        const eventTitles = [...new Set(saleItems.map(si => {
            const item = sampleData.items.find(i => i.itemID === si.itemID);
            const event = sampleData.events.find(e => e.eventID === item.eventID);
            return event.title;
        }))];
        
        return {
            ...sale,
            customerName: `${customer.firstName} ${customer.lastName}`,
            eventTitle: eventTitles.length > 0 ? eventTitles[0] : 'Unknown Event',
            eventTitles: eventTitles // In case sale spans multiple events
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
