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
  - name: VARCHAR(50)
  - price: VARCHAR(50)
  - id: SERIAL PRIMARY KEY
  ### User - 'TABLE users'
  - firstname: VARCHAR(50)
  - lastname: VARCHAR(50)
  - password: VARCHAR(50)
  - token: VARCHAR

  ### Order - 'TABLE orders'
  - id: SERIAL PRIMARY KEY
  - prduct_ids: ARRAY
  - product_quantities: INTEGER
  - user_id: VARCHAR
  - status: VARCHAR
  - products: JSON