const express = require('express')
const redirectController = express.Router()
const linkService = require('../services/linkService')
const utils = require('../utils/utils')
const axios = require('axios')

/**
 * Handle requests to GET '/'. This route is used to find
 * the title of the page sent in via the url query param.
 * @param {object} request Express request object 
 * @param {object} response Express response object 
 */
const getPageTitle = async (request, response) => {
  if (request.query.url) {
    // make a request to the URL received in query
    axios(request.query.url)
      .then((res) => response.json({ // send the extracted title from HTML in response
        title: utils.parsePageTitle(res.data)
      })) 
      .catch((error) => response.status(400).json({ // catch possible errors
        error: 'Invalid url value!'
      }))
  } else {
    response.status(400).json({
      error: 'Missing url query parameter!'
    })
  }
}

/**
 * Handle requests to GET '/:code', where code is the shortened code
 * either automatically generated or selected by the user when
 * creating a link.
 * 
 * If a row with that code exists in the database, it will redirect 
 * the user to the full URL. Otherwise, it will redirect the user
 * to the frontend's 404
 * @param {object} request Express request object 
 * @param {object} response Express response object 
 */
const handleRedirect = async (request, response) => {
  const link = await linkService.findByCode(request.params.code)
  if (link) {
    // update link's views in the database by one
    linkService.update(link.id, { views: link.views + 1 })

    response.redirect(link.original_link)
  } else {
    const appHost = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

    // redirect to frontend's 404 page if a link wasn't found
    response.redirect(`${appHost}/404`)
  }
}

// route, handler
redirectController.get('/', getPageTitle)
redirectController.get('/:code', handleRedirect)

module.exports = redirectController