# URL Shortener

Convert long URLs into shortened, customizable links.

## Development Guides

### [Backend](/server/README.md)

### [Frontend](/client/README.md)

## Deployment (Docker)

To run the project via Docker, please make sure Docker is installed and working correctly in your machine. View [Docker's official download and installation guide for more details.](https://docs.docker.com/get-docker/)

1. Navigate to the project's root folder using your terminal of choice.
2. Build and start the database, server, and client containers.
```sh
docker-compose up -d
```

To stop the running containers, use the ```docker-compose stop``` command. To run them again, use the ```docker-compose up -d``` command.

To deploy the project without Docker, please view the instructions in the [backend's README](/server/README.md) and in the [frontend's README](/client/README.md)

## Features
- Create shortened version of a link, either with a custom link or with a generated code
- View list of links created and number of times each one was visited
- Redirect to original link in a new tab after clicking or accessing the shortened link
- Edit a link's information (URL, title, code)
- Delete a link
- Light / Dark Theme - who doesn't like dark mode?

## Tech Stack

### Back end

- Node.js (+ Express.js)
- Prisma (ORM)
- Mocha + Chai (Unit testing)
- MySQL database

### Front end

- Vue 3
- Pinia
- Tailwind
- Vitest + Vue Test Utils (Unit / Component testing)
- Cypress (E2E testing)

### Deployment
- Docker + Docker Compose