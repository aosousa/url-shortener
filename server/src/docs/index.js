const jsDoc = require('swagger-jsdoc')

const definition = {
  openapi: '3.1.0',
  info: {
    title: 'URL Shortener API',
    version: '1.0.0',
    description: 'Documentation for the URL Shortener API endpoints'
  }
}

const options = {
  definition,
  apis: [__dirname + "\\endpoints\\*.yaml"]
}

module.exports = jsDoc(options)