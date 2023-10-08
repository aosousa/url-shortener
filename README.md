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
- Detect title of the original link when creating a new link

![Create Link](/images/create_link.png)


- View list of links created and number of times each one was visited

![Home](/images/home_dark.png)

- Redirect to original link in a new tab after clicking or accessing the shortened link
- Redirect to 404 page when trying to access a link through a short code that doesn't exist

![404](/images/404.png)

- Copy short link to clipboard

![Copy to Clipboard](/images/copy_to_clipboard.png)

- Edit a link's information (URL, title, code)

![Edit Link](/images/edit_link.png)

- Delete a link

![Delete Link](/images/delete_link.png)

- Light / Dark Theme - who doesn't like dark mode?

![Light Theme](/images/home_light.png) ![Dark Theme](/images/home_dark.png)

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