-- Create table for users
CREATE TABLE IF NOT EXISTS users
(
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(1024) NOT NULL UNIQUE,
    password_hash VARCHAR(1024) NOT NULL,
    full_name     VARCHAR(1024) NOT NULL
);

-- Create table for roles. Roles define permissions for a application user
CREATE TABLE IF NOT EXISTS roles
(
    id        SERIAL PRIMARY KEY,
    name VARCHAR(1024) NOT NULL UNIQUE
);


-- m2m connection table for user roles
CREATE TABLE IF NOT EXISTS user_roles
(
    user_id INT NOT NULL REFERENCES users,
    role_id INT NOT NULL REFERENCES roles,

    CONSTRAINT user_roles_pk PRIMARY KEY (user_id, role_id)
);