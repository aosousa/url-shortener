const express = require('express')
const linkController = express.Router()
const { body, validationResult } = require('express-validator')

const linkService = require('../services/linkService')

const utils = require('../utils/utils')

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
  const link = await linkService.findLinkByCode(request.params.code)
  if (link) {
    // update link's views in the database by one
    linkService.updateLink(link.id, { views: link.views + 1 })

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

/**
 * Handle requests to POST '/'. Create a new link if all of the required
 * properties are in the body, otherwise return error
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const createLink = async (request, response) => {
  const result = validationResult(request)
  if (!result.isEmpty()) {
    return response.status(400).send({
      error: `Invalid values in the following fields: ${result.array().map((err) => err.path).join(', ')}.`
    })
  }

  let linkCode = request.body.link_code ?? utils.generateLinkCode(8)

  // check if code is unique
  let codeExists = await linkService.findLinkByCode(linkCode)

  if (request.body.link_code) {
    if (codeExists) {
      return response.status(400).send({
        error: `Specified code is already taken!`
      })
    }
  } else {
    // regenerate code until a new one is found
    while (codeExists != null) {
      linkCode = utils.generateLinkCode(8)
      codeExists = await linkService.findLinkByCode(linkCode)
    }
  }

  const newLink = await prisma.link.create({
    data: {
      ...request.body,
      link_code: linkCode
    }
  })

  response.json(newLink)
}

linkController.get('/:code', handleRedirect)
linkController.get('/', getLinks)
linkController.post('/', [
  body('original_link').custom(async value => {
    // empty URL will fail the validation so we don't need to add the .notEmpty() validation
    const linkIsValid = utils.validateURL(value)
    if (!linkIsValid) {
      throw new Error("Invalid link!")
    }
  }),
  body('link_code').isLength({ min: 1, max: 8 })
], createLink)

module.exports = linkController