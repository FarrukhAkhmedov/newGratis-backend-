CREATE TABLE "userInfo"(
    user_id SERIAL PRIMARY KEY,
    userName VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(50),
    since VARCHAR(70),
    avatar VARCHAR(255)
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);