const express = require('express')
const redirectController = express.Router()
const linkService = require('../services/linkService')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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
    // TODO: redirect to frontend's 404 page
    response.status(400).json({
      error: 'No link with that code found was found in the database'
    })
  }
}

/**
 * Handle requests to GET '/'. Return the full list of links.
 * @param {*} request 
 * @param {*} response 
 */
const getLinks = async (request, response) => {
  const links = await prisma.link.findMany()

  response.json(links)
}

redirectController.get('/:code', handleRedirect)
redirectController.get('/', getLinks)

module.exports = redirectController