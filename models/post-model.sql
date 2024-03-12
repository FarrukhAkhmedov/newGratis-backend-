CREATE TABLE post(
    post_id INTEGER,
    address VARCHAR(255),
    description VARCHAR(900),
    objectType VARCHAR(255),
    photo VARCHAR(255),
    FOREIGN KEY (post_id) REFERENCES "allPosts"(id)
);


