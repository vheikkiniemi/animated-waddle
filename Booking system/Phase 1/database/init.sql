-- Users table to store user information
CREATE TABLE xyz123_users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phonenumber INTEGER UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('reserver', 'admin')) NOT NULL,
    birthdate DATE NOT NULL
);

-- Resources table to store resource information
CREATE TABLE xyz123_resources (
    resource_id SERIAL PRIMARY KEY,
    resource_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table to store reservation information
CREATE TABLE xyz123_reservations (
    reservation_id SERIAL PRIMARY KEY,
    resource_id INT REFERENCES xyz123_resources(resource_id) ON DELETE CASCADE,
    user_id INT REFERENCES xyz123_users(user_id) ON DELETE SET NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (start_time < end_time)
);

-- Index to improve performance for querying reservations
CREATE INDEX idx_reservations_resource_id ON xyz123_reservations(resource_id);
CREATE INDEX idx_reservations_user_id ON xyz123_reservations(user_id);

-- Trigger to update the updated_at field on modification
CREATE OR REPLACE FUNCTION update_timestamp()

RETURNS TRIGGER AS $$

BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;

$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resources_timestamp
BEFORE UPDATE ON xyz123_resources
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_reservations_timestamp
BEFORE UPDATE ON xyz123_reservations
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();