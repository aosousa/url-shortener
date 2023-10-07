const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    apiHost: 'http://localhost:8080'
  }
})