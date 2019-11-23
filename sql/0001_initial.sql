-- Create table for users
CREATE TABLE IF NOT EXISTS users
(
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(512)  NOT NULL UNIQUE,
    password   VARCHAR(1024) NOT NULL,
    first_name VARCHAR(512)  NOT NULL,
    last_name  VARCHAR(512)  NOT NULL
);

-- Insert users for testing purposes
INSERT INTO users (username, password, first_name, last_name) VALUES ('akovalyov', '12345', 'Anton', 'Kovalyov');
INSERT INTO users (username, password, first_name, last_name) VALUES ('vpruchkovskaya', '12345', 'Viktoria', 'Pruchkovskaya');