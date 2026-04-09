CREATE DATABASE tours;
USE tours;

CREATE TABLE customer (
    customer_id   INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    country       VARCHAR(100) NOT NULL,
    password      VARCHAR(255) NULL,
    auth_provider ENUM('LOCAL','GOOGLE','FACEBOOK') DEFAULT 'LOCAL',
    provider_id   VARCHAR(255) NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin (
    admin_id   INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       ENUM('SUPER_ADMIN','STAFF') NOT NULL DEFAULT 'STAFF',
    phone      VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_category (
    category_id      INT AUTO_INCREMENT PRIMARY KEY,
    category_name    VARCHAR(50) NOT NULL,
    description      TEXT,
    image_url        VARCHAR(255)
);

CREATE TABLE vehicle (
    vehicle_id       INT AUTO_INCREMENT PRIMARY KEY,
    category_id      INT NOT NULL,
    vehicle_number   VARCHAR(50) UNIQUE NOT NULL,
    name	     VARCHAR(255),
    color            VARCHAR(50),
    manufactured_year INT,
    adult_seats      INT,
    baby_seats       INT DEFAULT 0,
    luggage_capacity INT,
    price_per_day    DECIMAL(10,2),
    image_url        VARCHAR(255),
    vehicle_status   ENUM('AVAILABLE','BOOKED','MAINTENANCE') DEFAULT 'AVAILABLE',
    FOREIGN KEY (category_id) REFERENCES vehicle_category(category_id)
);

CREATE TABLE place (
    place_id    INT AUTO_INCREMENT PRIMARY KEY,
    place_name  VARCHAR(100) NOT NULL,
    image_url   VARCHAR(255),
    description TEXT
);

CREATE TABLE activity (
    activity_id   INT AUTO_INCREMENT PRIMARY KEY,
    activity_name VARCHAR(100) NOT NULL,
    image_url     VARCHAR(255),
    phone         VARCHAR(20),
    description   TEXT
);

CREATE TABLE place_activity (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    place_id    INT NOT NULL,
    activity_id INT NOT NULL,
    FOREIGN KEY (place_id)    REFERENCES place(place_id),
    FOREIGN KEY (activity_id) REFERENCES activity(activity_id)
);

CREATE TABLE package (
    package_id  INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(150) NOT NULL,
    days        INT NOT NULL,
    description TEXT,
    image_url   VARCHAR(255)
);

CREATE TABLE package_place (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    place_id   INT NOT NULL,
    day_number INT NOT NULL,
    FOREIGN KEY (package_id) REFERENCES package(package_id),
    FOREIGN KEY (place_id)   REFERENCES place(place_id)
);

CREATE TABLE booking (
    booking_id     INT AUTO_INCREMENT PRIMARY KEY,
    customer_id    INT NOT NULL,
    customer_name  VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    tour_type      ENUM('P2P','PACKAGE','CUSTOM') NOT NULL,
    category_id    INT NOT NULL,
    vehicle_id     INT NULL,

    -- trip details
    start_date     DATE NOT NULL,
    end_date       DATE NOT NULL,
    start_location VARCHAR(100),
    end_location   VARCHAR(100),

    -- days
    total_days     INT NOT NULL,
    days_required  INT NOT NULL,

    -- passengers
    no_of_luggages   VARCHAR(100),
    no_of_adults     INT NOT NULL DEFAULT 1,
    no_of_children   INT NOT NULL DEFAULT 0,
    ages_of_children TEXT,

    -- pricing (admin sets, customer accepts or rejects)
    quoted_price     DECIMAL(10,2) NULL,

    notes          TEXT,
    booking_date   DATE NOT NULL DEFAULT (CURRENT_DATE),

    -- status
    booking_status   ENUM(
                     'PENDING',
                     'QUOTED',
                     'ACCEPTED',
                     'REJECTED',
                     'CONFIRMED',
                     'TOUR_STARTED',
                     'COMPLETED',
                     'CLOSED',
                     'CANCELLED'
                   ) NOT NULL DEFAULT 'PENDING',

    -- milestone timestamps (set by admin actions)
    quoted_at       TIMESTAMP NULL,
    confirmed_at    TIMESTAMP NULL,
    tour_started_at TIMESTAMP NULL,
    completed_at    TIMESTAMP NULL,
    closed_at       TIMESTAMP NULL,

    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (category_id) REFERENCES vehicle_category(category_id),
    FOREIGN KEY (vehicle_id)  REFERENCES vehicle(vehicle_id)
);

CREATE TABLE booking_package (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL UNIQUE,
    package_id INT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id),
    FOREIGN KEY (package_id) REFERENCES package(package_id)
);

CREATE TABLE booking_custom (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    booking_id     INT NOT NULL UNIQUE,
    itinerary_text TEXT,
    itinerary_file VARCHAR(255),
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id)
);

CREATE TABLE payment (
    payment_id     INT AUTO_INCREMENT PRIMARY KEY,
    booking_id     INT NOT NULL,
    installment    ENUM('DEPOSIT','FINAL','FULL') NOT NULL,
    amount         DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CASH','BANK_TRANSFER') NOT NULL,
    received_date  DATE NOT NULL,
    recorded_by    INT NOT NULL,
    notes          TEXT,
    FOREIGN KEY (booking_id)  REFERENCES booking(booking_id),
    FOREIGN KEY (recorded_by) REFERENCES admin(admin_id)
);

CREATE TABLE review (
    review_id   INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    booking_id  INT NOT NULL UNIQUE,
    rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    driver_name VARCHAR(100),
    feedback    TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (booking_id)  REFERENCES booking(booking_id)
);

CREATE TABLE review_image (
    image_id  INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (review_id) REFERENCES review(review_id)
);

CREATE TABLE gallery (
    gallery_id  INT AUTO_INCREMENT PRIMARY KEY,
    image_url   VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE chat_topic (
    topic_id    INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    subject     VARCHAR(100),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE chat_message (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id   INT NOT NULL,
    sender     ENUM('CUSTOMER','ADMIN') NOT NULL,
    message    TEXT NOT NULL,
    sent_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES chat_topic(topic_id)
);