CREATE TABLE token(
    id SERIAL PRIMARY KEY,
    "refreshToken" VARCHAR(2000) NOT NULL,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);