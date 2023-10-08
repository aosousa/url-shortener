# URL Shortener (Client)

Frontend of the URL Shortener application. Built with:
* Vue 3
* Pinia (state management)
* Tailwind (CSS framework)
* Vitest + Vue Test Utils (Unit / Component testing)
* Cypress (E2E testing)

## Project Setup (Development)

This project relies on environment variables defined in ```.env``` files, such as the API base URI. As the project uses Vite, only variables prefixed with VITE_ can be used. Confirm that the values are correct for your setup, or change them to the correct values for your use case before continuing.

- [.env.development](.env.development) - used in development mode
- [.env.production](.env.production) - used in production builds
- [.env.test](.env.test) - used in Vitest tests

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
A production build (folder ```dist```) must be available before running this command. 
Both the client and the server must also be running in order for this to work correctly.

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

### E2E Tests


    ├── ...
    ├── cypress                 
    │   ├── e2e             # E2E test files
    │   ├── fixtures        # External pieces of the data can be used by the test files
    │   └── support         # Support files to add things like re-usable methods to use in the test files
    └── ...

### Source Files

    ├── ...
    ├── src                 
    │   ├── assets          # Public assets to use (e.g., CSS files)
    │   ├── classes         # JS classes to re-use across the application
    │   ├── components      # Vue components to use in the views
    |   │   ├── __tests__   # Test files for components
    |   |   ├── ...
    │   ├── router          # Vue router files, where the application's routes are defined
    |   ├── stores          # Pinia data stores
    |   |   ├── __tests__   # Test files for stores
    |   |   ├── ... 
    |   ├── tests           # Test configuration files
    |   |   ├── mocks       # Mock data for tests
    |   |   ├── ...
    |   ├── utils           # Utility classes / methods to re-use across the client source files
    |   ├── views           # Views loaded into routes in the router configuration file
    └── ...