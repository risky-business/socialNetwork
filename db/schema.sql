DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_profiles;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(100) NOT NULL,
    image_url VARCHAR(300),
    bio VARCHAR(400),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE friendships (
--     id SERIAL PRIMARY KEY,
--     sender_id INT REFERENCES users(id),
--     receiveer_id INT REFERENCES users(id),
--     status INT DEFAULT 1
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP
--
-- );
-- SELECT * FROM friendships
-- WHERE ((sender_id =$1 AND receiveer_id=$2)
-- OR (sender_id = $2 AND receiveer_id=$1))
-- AND (status =1 OR status= 2)
--
-- INSERT INTO friendships (receiveer_id, sender_id, status)
-- VALUES($1, $2, 1)
--
-- UPDATE friendships
-- SET updated_at = CURRENT_TIMESTAMP;
