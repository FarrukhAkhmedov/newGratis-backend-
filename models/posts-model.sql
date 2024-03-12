CREATE TABLE "allPosts"(
    id SERIAL PRIMARY KEY,
    "itemName" VARCHAR(50),
    qualityRating INTEGER,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);