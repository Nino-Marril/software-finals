CREATE DATABASE IF NOT EXISTS paldo_foods;
USE paldo_foods;

DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock_qty INT NOT NULL DEFAULT 0,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('Pending', 'Preparing', 'Out for Delivery', 'Completed', 'Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
  order_item_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE sessions (
  session_id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@paldofoods.com', '$2b$10$7k2Umtkw9CQohAYGMGzT9eWzG8eoRy1Wc1JqBxiTJqouzt5Qi78jG', 'admin'),
('customer', 'customer@paldofoods.com', '$2b$10$7k2Umtkw9CQohAYGMGzT9eWzG8eoRy1Wc1JqBxiTJqouzt5Qi78jG', 'customer');

INSERT INTO products (name, description, price, stock_qty, image_url) VALUES
('Pork Siomai', 'Juicy steamed pork siomai served with chili garlic sauce.', 45.00, 100, 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf'),
('Chicken Rice Bowl', 'Warm rice bowl with chicken toppings and savory sauce.', 99.00, 80, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d'),
('Special Batchoy', 'Hot noodle soup with pork, egg, and flavorful broth.', 85.00, 50, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624'),
('Iced Tea', 'Refreshing house-blend iced tea.', 35.00, 120, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc');


INSERT INTO products (name, description, price, stock_qty, image_url) VALUES 
('Fried Bangus (Milkfish)', 'Crispy pan-fried marinated milkfish served with spiced vinegar.', 120.00, 40, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2'),
('Sizzling Pork Sisig', 'Savory minced pork with onions, calamansi, and chili on a sizzling plate.', 150.00, 30, 'https://images.unsplash.com/photo-1626500155551-30910f545199'),
('Beef Pares', 'Braised beef brisket in a sweet and salty star anise broth with garlic fried rice.', 110.00, 60, 'https://images.unsplash.com/photo-1546549032-9571cd6b27df'),
('Pancit Guisado', 'Stir-fried noodles with fresh vegetables, pork, and shrimp.', 75.00, 90, 'https://images.unsplash.com/photo-1585032226651-759b368d7246'),
('Halo-Halo Special', 'Classic Filipino dessert with crushed ice, evaporated milk, and various sweet beans and jellies.', 65.00, 100, 'https://images.unsplash.com/photo-1626202133282-f8502c993092');

INSERT INTO orders (user_id, total_amount, status) VALUES
(2, 179.00, 'Pending');

INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES
(1, 1, 1, 45.00),
(1, 2, 1, 99.00),
(1, 4, 1, 35.00);