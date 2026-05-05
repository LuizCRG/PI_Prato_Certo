CREATE DATABASE IF NOT EXISTS prato_honesto;
USE prato_honesto;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('consumer', 'business', 'admin') NOT NULL DEFAULT 'consumer',
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS business_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_category ENUM('marmitaria', 'restaurant', 'snack', 'pastelaria') NOT NULL,
    phone VARCHAR(20),
    photo_url VARCHAR(500),
    cover_photo_url VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS places (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('marmitaria', 'restaurant', 'snack', 'pastelaria') NOT NULL,
    price_range ENUM('$', '$$', '$$$', '$$$$') NOT NULL,
    address VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500),
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    place_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    food_quality INT CHECK (food_quality >= 1 AND food_quality <= 5),
    cost_benefit INT CHECK (cost_benefit >= 1 AND cost_benefit <= 5),
    service INT CHECK (service >= 1 AND service <= 5),
    would_recommend BOOLEAN,
    photo_urls JSON, -- Armazena as imagens como JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (place_id, user_id)
);

CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    place_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    UNIQUE (user_id, place_id)
);

CREATE TABLE IF NOT EXISTS suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    place_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    address VARCHAR(255),
    description TEXT,
    photo_urls JSON,
    experience_types JSON,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
