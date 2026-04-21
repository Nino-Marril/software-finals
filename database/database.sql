CREATE DATABASE IF NOT EXISTS paldo_foods;
USE paldo_foods;

-- 1. Users Table
CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(255),
  `role` varchar(255),
  `password_hash` varchar(255), -- Requirement 1.c [cite: 51]
  `created_at` timestamp DEFAULT (now())
);

-- 2. Products Table (Changed ID name to be more standard)
CREATE TABLE `products` (
  `product_id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `price` decimal(10, 2) NOT NULL, -- Specified precision for calculations 
  `stock_qty` int NOT NULL -- Requirement for input validation [cite: 23]
);

-- 3. Orders Table
CREATE TABLE `orders` (
  `order_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `total_amount` decimal(10, 2),
  `status` varchar(255) DEFAULT 'Pending',
  `created_at` timestamp DEFAULT (now()),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- 4. Sessions Table
CREATE TABLE sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    id INT,  
    cart_data JSON, -- Requirement 6.b 
    expires_at TIMESTAMP,  
    FOREIGN KEY (id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 5. Order Items Table (Crucial for Order Summary [cite: 44, 79])
CREATE TABLE order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT, 
  product_id INT,
  quantity INT NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB;



-- 1. Seed Users (Including an Admin and a Customer)
INSERT INTO users (username, role, password_hash) VALUES
('admin_ken', 'admin', '$2b$10$StandardHashForTesting123'),
('cyrus_buyer', 'customer', '$2b$10$StandardHashForTesting456');

-- 2. Seed Products (To test Menu Navigation and Search)
INSERT INTO products (name, price, stock_qty) VALUES
('Pork Siomai (4pcs)', 45.00, 100),
('Ngohiong', 12.00, 150),
('Steamed Rice', 35.00, 80),
('Hanging Rice (Puso)', 5.00, 200),
('Special Batchoy', 85.00, 30),
('Iced Tea Large', 25.00, 60);

-- 3. Seed a Sample Order (To test Order Summary logic)
INSERT INTO orders (user_id, total_amount, status) VALUES
(2, 102.00, 'Pending');

-- 4. Seed Order Items (Linking the sample order to products)
-- This represents an order of 1 Siomai, 1 Steamed Rice, and 4 Puso
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
(1, 1, 1, 45.00),
(1, 3, 1, 35.00),
(1, 4, 4, 5.50);
