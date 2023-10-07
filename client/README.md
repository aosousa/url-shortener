# URL Shortener (Client)

Frontend of the URL Shortener application. Built with:
* Vue 3
* Pinia (state management)
* Tailwind (CSS framework)
* Vitest + Vue Test Utils (Unit / Component testing)
* Cypress (E2E testing)

## Project Setup (Development)

1. Navigate to the project's ```client``` folder using your terminal of choice.
2. Install the client's dependencies:
```sh
npm install
```

3. Compile and hot-reload in development mode:
```sh
npm run dev
```

## Commands Available

### Install Dependencies

```sh
npm install
```

### Compile and Hot-Reload for Development
```sh
npm run dev
```

### Compile and Minify for Production
```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)
```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)
Both the client and the server have to be running in order for the E2E tests to work.

```sh
npm run test:e2e
```

### Open Cypress Window to manually End-to-End Tests
Both the client and the server have to be running in order for the E2E tests to work.

```sh
npm run test:e2e:dev
```

### View Test Coverage Results
```sh
npm run coverage
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Folder Structure