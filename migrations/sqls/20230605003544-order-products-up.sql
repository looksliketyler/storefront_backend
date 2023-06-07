CREATE TABLE order_products (id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users (id), product_id INTEGER REFERENCES products (id), quantity INTEGER);
