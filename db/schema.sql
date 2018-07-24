DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_profiles;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- CREATE TABLE user_profiles (
--     id SERIAL PRIMARY KEY,
--     user_id INT NOT NULL REFERENCES users(id) UNIQUE,
--     age VARCHAR(50),
--     city VARCHAR(50),
--     url VARCHAR(50)
-- );
