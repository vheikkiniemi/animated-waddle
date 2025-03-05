-- enable the uuid-ossp extension 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- enable crypto functions
CREATE EXTENSION pgcrypto;

-- Users table: Minimized personal information, pseudonymization via user_token
CREATE TABLE zephyr_users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(15) CHECK (role IN ('reserver', 'administrator')) NOT NULL,
    birthdate DATE NOT NULL,
    user_token UUID UNIQUE DEFAULT uuid_generate_v4()  -- Pseudonymized identifier
);

-- Resources table: Stores information about the resources that can be reserved
CREATE TABLE zephyr_resources (
    resource_id SERIAL PRIMARY KEY,
    resource_name VARCHAR(100) NOT NULL,
    resource_description TEXT
);

-- Reservations table: Pseudonymized reservation entries, no direct user identity stored
CREATE TABLE zephyr_reservations (
    reservation_id SERIAL PRIMARY KEY,
    reserver_token UUID REFERENCES zephyr_users(user_token) ON DELETE CASCADE, -- Pseudonym reference
    resource_id INT REFERENCES zephyr_resources(resource_id),
    reservation_start TIMESTAMP NOT NULL,
    reservation_end TIMESTAMP NOT NULL,
    CHECK (reservation_end > reservation_start)
);

-- Logs table: Tracks administrator actions, e.g., add/delete resources, without exposing sensitive data
CREATE TABLE zephyr_admin_logs (
    log_id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES zephyr_users(user_id),
    action VARCHAR(255) NOT NULL,
    resource_id INT,
    reservation_id INT,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Function to check if the user is over 15 years old before making a reservation
CREATE OR REPLACE FUNCTION zephyr_check_age() RETURNS TRIGGER AS $$
BEGIN
    IF (EXTRACT(YEAR FROM AGE(NEW.reservation_start, (SELECT birthdate FROM zephyr_users WHERE user_token = NEW.reserver_token))) < 15) THEN
        RAISE EXCEPTION 'User must be over 15 years old to make a reservation';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce age check before inserting a reservation
CREATE TRIGGER zephyr_check_age_trigger
BEFORE INSERT ON zephyr_reservations
FOR EACH ROW
EXECUTE FUNCTION zephyr_check_age();

-- View for anonymous access: Shows booked resources without reserver’s identity (pseudonymized view)
CREATE VIEW zephyr_booked_resources_view AS
SELECT
    r.resource_name,
    res.reservation_start,
    res.reservation_end
FROM zephyr_resources r
JOIN zephyr_reservations res ON r.resource_id = res.resource_id;

-- Deletion function for the right to erasure (compliant with GDPR)
CREATE OR REPLACE FUNCTION zephyr_erase_user(user_id_to_erase INT) RETURNS VOID AS $$
DECLARE
    user_token_to_erase UUID;
BEGIN
    -- Find the pseudonym (token) of the user to erase
    SELECT user_token INTO user_token_to_erase FROM zephyr_users WHERE user_id = user_id_to_erase;

    -- Delete user and associated data
    DELETE FROM zephyr_reservations WHERE reserver_token = user_token_to_erase;
    DELETE FROM zephyr_users WHERE user_id = user_id_to_erase;
    
    -- Optionally, delete admin logs associated with the user
    DELETE FROM zephyr_admin_logs WHERE admin_id = user_id_to_erase;
END;
$$ LANGUAGE plpgsql;

-- Login logs 
CREATE TABLE zephyr_login_logs (
    log_id SERIAL PRIMARY KEY, -- this is enough, in this system there is no need to generate UUID
    user_token UUID NOT NULL REFERENCES zephyr_users(user_token) ON DELETE CASCADE, -- UUID is always unique
    login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NOT NULL -- Supports IPv4 and IPv6
);

INSERT INTO zephyr_users (username, password_hash, role, birthdate, user_token) 
VALUES ('whatsupdoc@looneytunes.tv', 'a0e8402fe185455606a2ae870dcbc4cd', 'reserver', '1980-04-12', 'b7a8d729-f5c3-4f5a-86e2-9cdb73511ad9');

INSERT INTO zephyr_users (username, password_hash, role, birthdate, user_token) 
VALUES ('doh@springfieldpower.net', 'd730fc82effd704296b5bbcff45f323e', 'administrator', '1975-05-10', 'f3b93c24-8b55-4a0d-8b3c-97c4b8a1e728');

INSERT INTO zephyr_users (username, password_hash, role, birthdate, user_token) 
VALUES ('darkknight@gothamwatch.org', '735f7f5e652d7697723893e1a5c04d90', 'reserver', '1988-09-15', '94e30d50-4b2e-47b4-920a-0c5f6721a5a2');

INSERT INTO zephyr_users (username, password_hash, role, birthdate, user_token) 
VALUES ('chimichanga@fourthwall.com', '7cb56c2b86150b797cff32eaef97f338', 'administrator', '1991-02-22', 'de3d09e1-fc3a-4938-80c6-bef1b45b91b2');

INSERT INTO zephyr_users (username, password_hash, role, birthdate, user_token) 
VALUES ('iamyourfather@deathstar.gov', '706ab9fc256efabf4cb4cf9d31ddc8eb', 'reserver', '1960-06-01', 'c02dd33f-198a-43e7-882f-b4a73b5dbf18');

INSERT INTO zephyr_users (username, password_hash, role, birthdate, user_token) 
VALUES ('elementary@221bbaker.uk', '12c9cef0bfb6b91c42b363b4cf02d8bb', 'administrator', '1982-01-07', '9c6ffbe1-44eb-4428-b3fd-bcc44f38de31');

INSERT INTO zephyr_users (username, password_hash, role, birthdate, user_token) 
VALUES ('genius@starkindustries.com', 'd50ba4dd3fe42e17e9faa9ec29f89708', 'reserver', '1970-05-29', 'af9c8d38-9d8f-4b71-9b48-e67212a6355a');

INSERT INTO zephyr_users (username, password_hash, role, birthdate, user_token) 
VALUES ('whysoserious@gothamchaos.net', 'f158d479ee181aac68b000a60e7a3d7a', 'administrator', '1985-07-18', 'dd0b5c4b-1e99-4193-98c8-317f48b4b6f6');

INSERT INTO zephyr_users (username, password_hash, role, birthdate, user_token) 
VALUES ('quackattack@duckburg.org', 'ea261222d4867b3ebdfadbe2b35e19d5', 'reserver', '1992-11-25', '4f5a3ef5-191e-4de0-a68e-53e349e6788b');

INSERT INTO zephyr_users (username, password_hash, role, birthdate, user_token) 
VALUES ('ruhroh@mysterymachine.com', 'ad17fbd845000b11678ccbf94e135b56', 'reserver', '1987-03-30', 'fb9d315b-d1f1-49a1-8717-f28db6b94989');
