-- SwiftPOS Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS swiftpos;
USE swiftpos;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS transaction_items;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS inventory_logs;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS stores;

-- Stores table (for multi-location support)
CREATE TABLE stores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    tax_rate DECIMAL(5,4) DEFAULT 0.0000,
    currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table (employees/staff)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'manager', 'cashier') DEFAULT 'cashier',
    store_id INT,
    pin VARCHAR(6), -- For quick PIN-based login
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id)
);

-- Customers table
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    total_purchases DECIMAL(10,2) DEFAULT 0.00,
    loyalty_points INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INT NULL, -- For subcategories
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    barcode VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 0,
    min_stock_level INT DEFAULT 0,
    max_stock_level INT DEFAULT 1000,
    unit VARCHAR(20) DEFAULT 'piece', -- piece, kg, liter, etc.
    tax_rate DECIMAL(5,4) DEFAULT 0.0000,
    is_active BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Inventory logs table (for tracking stock changes)
CREATE TABLE inventory_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT,
    change_type ENUM('stock_in', 'stock_out', 'adjustment', 'sale', 'return') NOT NULL,
    quantity_change INT NOT NULL, -- Positive for in, negative for out
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    notes TEXT,
    reference_id INT, -- Reference to transaction or other related record
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Transactions table (sales)
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    store_id INT NOT NULL,
    user_id INT NOT NULL, -- Cashier
    customer_id INT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'card', 'digital_wallet', 'check', 'store_credit') NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'completed',
    payment_reference VARCHAR(255), -- For card transactions, digital wallet IDs, etc.
    cash_received DECIMAL(10,2) DEFAULT 0.00,
    change_given DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    receipt_printed BOOLEAN DEFAULT FALSE,
    is_refunded BOOLEAN DEFAULT FALSE,
    refund_reason TEXT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Transaction items table (individual items in a transaction)
CREATE TABLE transaction_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert default data
-- Default store
INSERT INTO stores (name, address, phone, email, tax_rate) VALUES 
('SwiftPOS Main Store', '123 Business Street, City, State 12345', '+1-555-0123', 'info@swiftpos.com', 0.0875);

-- Default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, first_name, last_name, role, store_id) VALUES 
('admin', 'admin@swiftpos.com', '$2b$10$rJ7.5Q3vhU8yQ0nH8p3Kf.CzN7Zs8vK2mL1pR4tY6wE9aS3dF5gH', 'System', 'Administrator', 'admin', 1);

-- Default categories
INSERT INTO categories (name, description) VALUES 
('Electronics', 'Electronic devices and accessories'),
('Clothing', 'Apparel and fashion items'),
('Food & Beverages', 'Consumable items'),
('Home & Garden', 'Household and garden supplies'),
('Books & Media', 'Books, movies, music'),
('Sports & Outdoors', 'Sports equipment and outdoor gear'),
('Health & Beauty', 'Health and beauty products'),
('Toys & Games', 'Children toys and games');

-- Sample products
INSERT INTO products (sku, name, description, category_id, barcode, price, cost, stock_quantity, min_stock_level) VALUES 
('ELEC001', 'Wireless Bluetooth Headphones', 'High-quality wireless headphones with noise cancellation', 1, '1234567890123', 99.99, 45.00, 50, 10),
('ELEC002', 'USB-C Charging Cable', 'Fast charging USB-C cable, 6ft length', 1, '1234567890124', 19.99, 8.00, 100, 20),
('CLOTH001', 'Cotton T-Shirt', '100% cotton, available in multiple colors', 2, '1234567890125', 24.99, 12.00, 75, 15),
('FOOD001', 'Organic Coffee Beans', 'Premium organic coffee beans, 1lb bag', 3, '1234567890126', 12.99, 6.50, 30, 5),
('FOOD002', 'Energy Drink', 'Natural energy drink, 16oz can', 3, '1234567890127', 3.99, 1.80, 120, 24);

-- Sample customer
INSERT INTO customers (first_name, last_name, email, phone, total_purchases, loyalty_points) VALUES 
('John', 'Doe', 'john.doe@email.com', '+1-555-0456', 0.00, 0);

-- Create indexes for better performance
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_transaction_items_transaction ON transaction_items(transaction_id);
CREATE INDEX idx_inventory_logs_product ON inventory_logs(product_id);

-- Create triggers for automatic inventory tracking
DELIMITER //

-- Trigger to update inventory when a sale is made
CREATE TRIGGER update_inventory_on_sale 
AFTER INSERT ON transaction_items
FOR EACH ROW
BEGIN
    -- Update product stock
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity 
    WHERE id = NEW.product_id;
    
    -- Log the inventory change
    INSERT INTO inventory_logs (product_id, change_type, quantity_change, previous_quantity, new_quantity, reference_id)
    SELECT 
        NEW.product_id,
        'sale',
        -NEW.quantity,
        stock_quantity + NEW.quantity,
        stock_quantity,
        NEW.transaction_id
    FROM products WHERE id = NEW.product_id;
END//

-- Trigger to update customer total purchases
CREATE TRIGGER update_customer_purchases
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    IF NEW.customer_id IS NOT NULL THEN
        UPDATE customers 
        SET 
            total_purchases = total_purchases + NEW.total_amount,
            loyalty_points = loyalty_points + FLOOR(NEW.total_amount)
        WHERE id = NEW.customer_id;
    END IF;
END//

DELIMITER ;

-- Create a view for low stock products
CREATE VIEW low_stock_products AS
SELECT 
    p.id,
    p.sku,
    p.name,
    p.stock_quantity,
    p.min_stock_level,
    c.name as category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.stock_quantity <= p.min_stock_level AND p.is_active = TRUE;

-- Create a view for daily sales summary
CREATE VIEW daily_sales_summary AS
SELECT 
    DATE(transaction_date) as sale_date,
    COUNT(*) as transaction_count,
    SUM(subtotal) as subtotal,
    SUM(tax_amount) as tax_amount,
    SUM(discount_amount) as discount_amount,
    SUM(total_amount) as total_amount,
    AVG(total_amount) as avg_transaction_value
FROM transactions
WHERE payment_status = 'completed'
GROUP BY DATE(transaction_date);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON swiftpos.* TO 'swiftpos_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Display setup completion message
SELECT 'SwiftPOS database schema created successfully!' as Status;
