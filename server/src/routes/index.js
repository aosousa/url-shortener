const express = require('express')
const router = express.Router()
const swaggerUI = require('swagger-ui-express')
const apiDocs = require('../docs/index')

const linkController = require('../controllers/linkController')
const redirectController = require('../controllers/redirectController')

// set up Swagger UI - docs will not work as a link code
router.use('/docs', swaggerUI.serve)
router.get('/docs', swaggerUI.setup(apiDocs))

router.use('/', redirectController)
router.use('/links', linkController)

module.exports = router