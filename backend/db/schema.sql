Create database Tours;

use Tours;


CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_type (
    vehicle_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50),
    price_per_day DECIMAL(10,2),
    description TEXT
);

CREATE TABLE vehicle (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type_id INT,
    vehicle_number VARCHAR(50) UNIQUE, -- unique identification
    color VARCHAR(50),
    luggage_capacity INT,
    no_of_sheets INT,
    status ENUM('AVAILABLE','BOOKED','MAINTENANCE') DEFAULT 'AVAILABLE',
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_type(vehicle_type_id)
);


CREATE TABLE place (
    place_id INT AUTO_INCREMENT PRIMARY KEY,
    place_name VARCHAR(100),
    description TEXT
);


CREATE TABLE package_tour (
    package_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150),
    days INT,
    description TEXT
);

CREATE TABLE package_place (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_id INT,
    place_id INT,
    UNIQUE (package_id, place_id),  --You cannot add the same place twice to the same package
    FOREIGN KEY (package_id) REFERENCES package_tour(package_id),
    FOREIGN KEY (place_id) REFERENCES place(place_id)
);

CREATE TABLE custom_tour (
    custom_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_days INT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE custom_tour_place (
    id INT AUTO_INCREMENT PRIMARY KEY,
    custom_id INT,
    place_id INT,
    UNIQUE (custom_id, place_id),  
    FOREIGN KEY (custom_id) REFERENCES custom_tour(custom_id),
    FOREIGN KEY (place_id) REFERENCES place(place_id)
);

CREATE TABLE point_to_point_tour (
    p2p_id INT AUTO_INCREMENT PRIMARY KEY,
    start_location VARCHAR(100),
    end_location VARCHAR(100),
    base_price DECIMAL(10,2)
);

CREATE TABLE season (
    season_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    start_date DATE,
    end_date DATE,
    price_increase_percent DECIMAL(5,2)
);

CREATE TABLE booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    
    user_id INT,
    phone VARCHAR(20),

    vehicle_id INT, 
    vehicle_type_id INT,

    tour_type ENUM('P2P','PACKAGE','CUSTOM'),
    tour_id INT NOT NULL,

    
    total_days INT,
    vehicle_price_per_day DECIMAL(10,2),

    booking_date DATE,
    travel_date DATE,

    season_id INT,

    status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',

    total_price DECIMAL(10,2),

     FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id)
);


CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    amount DECIMAL(10,2),
    payment_method ENUM('CARD','CASH','ONLINE'),
    payment_status ENUM('PENDING','COMPLETED','FAILED') DEFAULT 'PENDING',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id)
);

CREATE TABLE review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE review_image (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT,
    image_url VARCHAR(255),
    FOREIGN KEY (review_id) REFERENCES review(review_id)
);

CREATE TABLE gallery (
    gallery_id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255),
    description TEXT
);



CREATE TABLE chat_topic (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    subject VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE chat_message (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id INT,
    sender ENUM('CUSTOMER','ADMIN'),
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES chat_topic(topic_id)
);