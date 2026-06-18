CREATE TABLE passenger (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nationality VARCHAR(100),
    passport_no VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flight (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    flight_no VARCHAR(20) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    depart_time TIMESTAMP NOT NULL,
    arrive_time TIMESTAMP NOT NULL,
    gate VARCHAR(20),
    status VARCHAR(50) NOT NULL
);

CREATE TABLE seat (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    flight_id BIGINT NOT NULL,
    seat_row INT NOT NULL,
    seat_col VARCHAR(5) NOT NULL,
    type VARCHAR(20) NOT NULL, -- WINDOW, MIDDLE, AISLE
    status VARCHAR(50) NOT NULL, -- AVAILABLE, BOOKED
    CONSTRAINT fk_seat_flight FOREIGN KEY (flight_id) REFERENCES flight(id) ON DELETE CASCADE
);

CREATE TABLE booking (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    passenger_id BIGINT NOT NULL,
    flight_id BIGINT NOT NULL,
    seat_id BIGINT UNIQUE,
    booking_ref VARCHAR(10) UNIQUE NOT NULL,
    CONSTRAINT fk_booking_passenger FOREIGN KEY (passenger_id) REFERENCES passenger(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_flight FOREIGN KEY (flight_id) REFERENCES flight(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_seat FOREIGN KEY (seat_id) REFERENCES seat(id) ON DELETE SET NULL
);

CREATE TABLE seat_exchange_request (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    requester_booking_id BIGINT NOT NULL,
    target_seat_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL, -- PENDING, ACCEPTED, REJECTED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_exchange_booking FOREIGN KEY (requester_booking_id) REFERENCES booking(id) ON DELETE CASCADE,
    CONSTRAINT fk_exchange_seat FOREIGN KEY (target_seat_id) REFERENCES seat(id) ON DELETE CASCADE
);

CREATE TABLE baggage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    tag_no VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL, -- CHECKED_IN, LOADED, IN_TRANSIT, ARRIVED, BELT_CLAIM
    location VARCHAR(100),
    belt_no VARCHAR(20),
    CONSTRAINT fk_baggage_booking FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE
);

CREATE TABLE notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    passenger_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL, -- FLIGHT_UPDATE, GATE_CHANGE, BAGGAGE, BOARDING, CONNECTION_RISK
    message VARCHAR(255) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_passenger FOREIGN KEY (passenger_id) REFERENCES passenger(id) ON DELETE CASCADE
);

CREATE TABLE chat_session (
    id VARCHAR(50) PRIMARY KEY,
    passenger_id BIGINT NOT NULL,
    flight_id BIGINT,
    messages JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_passenger FOREIGN KEY (passenger_id) REFERENCES passenger(id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_flight FOREIGN KEY (flight_id) REFERENCES flight(id) ON DELETE SET NULL
);
