# URL Shortener (Server)

Backend of the URL Shortener application. Built with:
* Node.js (+ Express.js)
* Prisma (ORM)
* Mocha + Chai (Unit testing)
* MySQL database

## Requirements
* Node.js v18.18.0 (current LTS)

## Database Setup
Use the [database script](../database/url_shortener.sql) to create the required MySQL database for this project. 

If the script was successfully executed in your tool of choice (e.g., PHPMyAdmin, MySQL Workbench, DBeaver), you should be able to see a ```url_shortener``` database, with a ```link``` table in it.

![Example database](images/database.png)

## Project Setup (Development)
1. Create the database as mentioned above. The REST API will not work if the database is not created correctly.
2. Navigate to the project's ```server``` folder using your terminal of choice.
3. Install the server's dependencies:
```sh
npm install
```

4. Set up Prisma ORM. The first command generates Prisma models based on the database tables, whereas the second generates the Prisma client used in the API.
```sh
npx prisma db pull
npx prisma migrate
```

5. Start the server with Nodemon (with Hot Reload for development):
```sh
npm run start
```

API documentation is then available via the ```/docs``` endpoint (e.g., http://localhost:8080/docs)

## Commands Available

### Install Dependencies
```sh
npm install
```

### Start the server with Nodemon (with Hot Reload for Development)
```sh
npm run start
```

### Set up Prisma schema and start the server (without Nodemon) - used mainly in production environment
```sh
npm run start:migrate
```

### Run tests
```sh
npm run test
```

## Folder Structure