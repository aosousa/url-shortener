const express = require('express')
const redirectController = express.Router()
const linkService = require('../services/linkService')

/**
 * Handle requests to GET '/:code', where code is the shortened code
 * either automatically generated or selected by the user when
 * creating a link.
 * 
 * If a row with that code exists in the database, it will redirect 
 * the user to the full URL. Otherwise, it will redirect the user
 * to the frontend's 404
 * @param {*} request 
 * @param {*} response 
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

/**
 * Handle requests to GET '/'. Return the full list of links.
 * @param {*} request 
 * @param {*} response 
 */
const getLinks = async (request, response) => {
  const links = await linkService.findAll()

  response.json(links)
}

redirectController.get('/:code', handleRedirect)
redirectController.get('/', getLinks)

module.exports = redirectController