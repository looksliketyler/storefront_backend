# Science Fiction Merch Store

## Getting Started
Start by installing dependences
- run 'npm install' or 'npm i' to install node_modules

## Scripts
- 'npm run watch' -- this command will start the local server
- 'npm run test' -- this command will run jasmine tests
- 'docker-compose up' -- this will use docker to start psql databse

## Relevant Ports
- Database will run on port 5432
- Local server will run on port 3000

## Relevant Info
This project connects to a database for housing scifi merch
- A user can be created, and this user will be able to view products and orders.

## ENV
- Will need a .env at root directory file with following setup
  - POSTGRES_HOST=127.0.0.1
  - POSTGRES_DB=scifi_merch_dev
  - POSTGRES_TEST_DB=scifi_merch_test
  - POSTGRES_USER=(postgres user)
  - POSTGRES_PASSWORD=(your password)
  - ENV=dev
  - TOKEN=(token to pass to jwt)