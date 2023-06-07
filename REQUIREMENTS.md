# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
### Products
- Index route - '/getAllProducts' - [GET]
- Show route - '/getProduct/:id' - [GET]
- Create [token required] - '/createProduct' - [POST]
  - Payload - { name: string, price: string }

### Users
- Index [token required] - '/getAllUsers/:token' = [GET]
- Show [token required] - '/getUserData/:username/:token' - [GET]
- Create - '/createUser' - [POST]
  - Payload - { firstname: string, lastname: string, username: string, password: string }

### Orders
- Show route - [token required] - '/getCurrentOrder/:username/:token - [GET]
- Create an order - '/createOrder' - [POST]
  - Payload - { productsInOrder: [ { name: string, price: string, id: number } ], status: string ('active or complete will be sent') }

## Data Shapes for DB
### Product - 'TABLE products'
- name: VARCHAR(255)
- price: VARCHAR(255)
- id: SERIAL PRIMARY KEY
### User - 'TABLE users'
- id: SERIAL PRIMARY KEY
- firstname: VARCHAR(255)
- lastname: VARCHAR(255)
- username: VARCHAR(255)
- password: VARCHAR(255)
- token: VARCHAR(255)
### Order - 'TABLE orders'
- id: SERIAL PRIMARY KEY
- product_ids: JSON
- product_quantities: INTEGER
- user_id: INTEGER - FOREIGN KEY - REFERENCES User (id)
- status: VARCHAR(255)
- products: JSON

### OrderProduct - 'TABLE order_products'
- id: SERIAL PRIMARY KEY
- user_id: INTEGER - FOREIGN KEY - REFERENCES User (id)
- product_id: INTEGER - FOREIGN KEY - REFERENCES Product (id)
- quantity: INTEGER