CREATE DATABASE IF NOT EXISTS paldo_foods;
USE paldo_foods;

DROP TABLE IF EXISTS cart;
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
  category ENUM('chicken','pork','beef','fish','drinks') NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock_qty INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category)
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

CREATE TABLE cart (
  cart_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id)
);


INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@paldofoods.com', '$2b$10$ql0rgrBl//u0u3rWGt1SdeQK32fFmPbRLkY6JqNB/D2lpRk.eTXly', 'admin'),
('customer', 'customer@paldofoods.com', '$2b$10$ql0rgrBl//u0u3rWGt1SdeQK32fFmPbRLkY6JqNB/D2lpRk.eTXly', 'customer');

INSERT INTO products (name, category, description, price, stock_qty, image_url) VALUES
-- Chicken
('Chicken Adobo',     'chicken', 'Classic Filipino chicken simmered in soy sauce, vinegar, and garlic.', 130.00, 60, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=640&q=80&auto=format&fit=crop'),
('Chicken Inasal',    'chicken', 'Bacolod-style grilled chicken marinated in lemongrass and calamansi.', 150.00, 50, 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=640&q=80&auto=format&fit=crop'),
('Fried Chicken',     'chicken', 'Crispy golden fried chicken served with gravy and rice.',              145.00, 70, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=640&q=80&auto=format&fit=crop'),
('Chicken Rice Bowl', 'chicken', 'Warm rice bowl with chicken toppings and savory sauce.',                99.00, 80, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=640&q=80&auto=format&fit=crop'),

-- Pork
('Lechon Kawali',     'pork',    'Deep-fried crispy pork belly served with liver sauce.',                180.00, 40, 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=640&q=80&auto=format&fit=crop'),
('Pork Sinigang',     'pork',    'Sour tamarind soup with tender pork and fresh vegetables.',           160.00, 45, 'https://images.unsplash.com/photo-1583224994076-ae3ab8a6cd3a?w=640&q=80&auto=format&fit=crop'),
('Pork Siomai',       'pork',    'Juicy steamed pork siomai served with chili garlic sauce.',            45.00, 100,'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=640&q=80&auto=format&fit=crop'),
('Special Batchoy',   'pork',    'Hot noodle soup with pork, egg, and flavorful broth.',                  85.00, 50, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=640&q=80&auto=format&fit=crop'),

-- Beef
('Beef Tapa',         'beef',    'Sweet and savory cured beef served with garlic rice and egg.',        150.00, 50, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=640&q=80&auto=format&fit=crop'),
('Beef Caldereta',    'beef',    'Rich tomato-based beef stew with potatoes, carrots, and bell pepper.',175.00, 40, 'https://images.unsplash.com/photo-1547928576-b822bc410bdf?w=640&q=80&auto=format&fit=crop'),
('Bulalo',            'beef',    'Hearty beef shank and marrow soup with corn and pechay.',             220.00, 30, 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=640&q=80&auto=format&fit=crop'),
('Beef Steak',        'beef',    'Tender beef strips in soy-lemon-onion sauce, Filipino bistek style.', 190.00, 35, 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=640&q=80&auto=format&fit=crop'),

-- Fish
('Fried Bangus',      'fish',    'Crispy fried milkfish marinated in vinegar, garlic, and peppercorns.',150.00, 40, 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=640&q=80&auto=format&fit=crop'),
('Grilled Tilapia',   'fish',    'Freshly grilled tilapia seasoned with herbs and spices.',             135.00, 45, 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=640&q=80&auto=format&fit=crop'),
('Fish Fillet',       'fish',    'Crispy golden-brown white fish fillet served with tartar sauce.',     120.00, 60, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=640&q=80&auto=format&fit=crop'),
('Sinigang na Isda',  'fish',    'Traditional Filipino sour soup with fish and fresh local vegetables.',165.00, 30, 'https://images.unsplash.com/photo-1626509135522-646d6767233e?w=640&q=80&auto=format&fit=crop'),

-- Drinks
('Iced Tea',          'drinks',  'Refreshing house-blend iced tea.',                                      35.00, 120,'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=640&q=80&auto=format&fit=crop'),
('Coke 1.5L',         'drinks',  'Ice-cold 1.5 liter Coca-Cola, perfect for sharing.',                    65.00, 80, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=640&q=80&auto=format&fit=crop');
