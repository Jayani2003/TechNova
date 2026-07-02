CREATE DATABASE tours;
USE tours;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    role ENUM('ADMIN','CUSTOMER') DEFAULT 'CUSTOMER',

    contact_number VARCHAR(20) NULL,
    street_address VARCHAR(255) NULL,
    country VARCHAR(100) NULL,
    zipcode VARCHAR(20) NULL,

    emergency_name          VARCHAR(150) NULL,
    emergency_phone         VARCHAR(30) NULL,
    emergency_relationship  VARCHAR(50) NULL,

    auth_provider ENUM('LOCAL','GOOGLE','FACEBOOK') DEFAULT 'LOCAL',
    provider_id VARCHAR(255) NULL,

    status ENUM('ACTIVE','BLOCKED') DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
    vehicle_license  VARCHAR(100),
    name	     VARCHAR(255),
    color            VARCHAR(50),
    manufactured_year INT,
    adult_seats      INT,
    baby_seats       INT DEFAULT 0,
    luggage_capacity INT,
    price_per_day    DECIMAL(10,2),
    insurance_provider VARCHAR(100),
    insurance_start_date DATE,
    insurance_end_date DATE,
    image_url        VARCHAR(255),
    vehicle_status   ENUM('AVAILABLE','BOOKED','MAINTENANCE') DEFAULT 'AVAILABLE',
    brand            VARCHAR(100),
    model            VARCHAR(100),
    fuel_type        VARCHAR(50),
    transmission     VARCHAR(50),
    air_conditioning BOOLEAN DEFAULT FALSE,
    mileage          INT,
    engine_capacity  VARCHAR(50),
    features         TEXT,
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

CREATE TABLE guid (
    guid_id           INT AUTO_INCREMENT PRIMARY KEY,
    guid_name         VARCHAR(100) NOT NULL,
    nic               VARCHAR(50) NOT NULL,
    contact_details   TEXT NOT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE package (
    package_id  INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(150) NOT NULL,
    type        ENUM('ADVENTURE','CULTURAL HERITAGE','WELLNESS & AYURVEDA','BEACH SIDE','HILL COUNTRY','SAFARI') NOT NULL,
    days        ENUM ('7 DAYS','14 DAYS','21 DAYS','28 DAYS') NOT NULL,
    description TEXT,
    image_url   VARCHAR(255),
    guid_id     INT NULL,
    FOREIGN KEY (guid_id) REFERENCES guid(guid_id) ON DELETE SET NULL
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
    user_id        INT NOT NULL,
    customer_name  VARCHAR(100) NOT NULL,
    contact_platform  VARCHAR(30)  NOT NULL DEFAULT 'mobile',
    contact_number    VARCHAR(150) NOT NULL,
    contact_platform2 VARCHAR(30)  NULL,
    contact_number2   VARCHAR(150) NULL,
    tour_type      ENUM('P2P','PACKAGE','CUSTOM') NOT NULL,
    category_id    INT NOT NULL,
    vehicle_id     INT NULL,

    -- trip details
    start_date     DATE NOT NULL,
    end_date       DATE NOT NULL,
    pickup_time    TIME,                   
    start_location VARCHAR(100),
    end_location   VARCHAR(100),

    -- days
    total_days     INT NOT NULL,
    days_required  INT NOT NULL,

    -- passengers
    luggage_10kg        INT DEFAULT 0,
    luggage_25kg        INT DEFAULT 0,
    luggage_35kg        INT DEFAULT 0,
    luggage_custom_count INT DEFAULT 0,
    luggage_custom_desc VARCHAR(255) NULL,    
    no_of_adults     INT NOT NULL DEFAULT 1,
    no_of_children   INT NOT NULL DEFAULT 0,
    ages_of_children TEXT NULL,

    -- pricing (admin sets, customer accepts or rejects)
    quoted_price     DECIMAL(10,2) NULL,

    notes          TEXT,
    tour_thoughts  TEXT,
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

    FOREIGN KEY (user_id) REFERENCES user(user_id),
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

CREATE TABLE booking_custom_cities (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    city_name  VARCHAR(100) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE
);

CREATE TABLE booking_custom_activities (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    booking_id    INT NOT NULL,
    activity_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE
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
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id),
    FOREIGN KEY (recorded_by) REFERENCES user(user_id)
);

CREATE TABLE review (
    review_id   INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_id  INT NOT NULL UNIQUE,
    rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    driver_name VARCHAR(100),
    title       VARCHAR(150),
    feedback    TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (booking_id)  REFERENCES booking(booking_id)
);

CREATE TABLE review_image (
    image_id  INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (review_id) REFERENCES review(review_id)
);

CREATE VIEW review_star_summary AS
SELECT
    COUNT(*) AS total_reviews,
    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star_reviews,
    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star_reviews,
    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star_reviews,
    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star_reviews,
    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star_reviews
FROM review;

CREATE TABLE gallery_location (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    description TEXT,
    pin_color VARCHAR(7) DEFAULT '#00b0a5',
    photo_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_location (name, region)
);

CREATE TABLE gallery (
    gallery_id  INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    description TEXT,
    location_id INT NULL,
    season ENUM('dry', 'inter1', 'swmonsoon', 'inter2') DEFAULT 'dry',
    mood ENUM('adventure', 'romantic', 'family', 'scenic', 'cultural', 'wildlife') DEFAULT 'adventure',
    event VARCHAR(100),
    tourist_name VARCHAR(150),
    captured_date DATE,
    tags JSON,
    with_tourists BOOLEAN DEFAULT FALSE,
    status ENUM('draft', 'published') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES gallery_location(location_id) ON DELETE SET NULL
);

CREATE TABLE contact_inquiry (
    inquiry_id   INT AUTO_INCREMENT PRIMARY KEY,
    sender_name  VARCHAR(100) NOT NULL,
    sender_email VARCHAR(100) NOT NULL,
    sender_phone VARCHAR(20),
    subject      VARCHAR(100),
    message      TEXT NOT NULL,
    is_read      BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_topic (
    topic_id    INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject     VARCHAR(100),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE chat_message (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    topic_id   INT NOT NULL,
    sender_id INT NOT NULL,
    message    TEXT NOT NULL,
    sent_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES chat_topic(topic_id),
    FOREIGN KEY (sender_id) REFERENCES user(user_id)
);