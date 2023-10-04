const express = require('express')
const linkController = express.Router()
const { body, validationResult } = require('express-validator')
const linkService = require('../services/linkService')
const utils = require('../utils/utils')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Handle requests to POST '/links/'. Create a new link if all of the required
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

  let linkCode = request.body.link_code && request.body.link_code !== '' ? request.body.link_code : utils.generateLinkCode(8)

  // check if code is unique
  let codeExists = await linkService.findByCode(linkCode)

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
      codeExists = await linkService.findByCode(linkCode)
    }
  }

  const newLink = await prisma.link.create({
    data: {
      title: request.body.title,
      original_link: request.body.original_link,
      link_code: linkCode
    }
  })

  response.json(newLink)
}

/**
 * Handle requests to PUT '/links/:id'. Update a link if one is found
 * with the ID received in URL, otherwise return error
 * @param {*} request 
 * @param {*} response 
 */
const updateLink = async (request, response) => {
  const result = validationResult(request)
  if (!result.isEmpty()) {
    return response.status(400).send({
      error: `Invalid values in the following fields: ${result.array().map((err) => err.path).join(', ')}.`
    })
  }

  // check if link with ID exists
  const link = await linkService.findByID(Number(request.params.id))
  if (!link) {
    return response.status(400).send({
      error: 'No link was found with the specified ID'
    })
  }
}

/**
 * Handle requests to DELETE '/links/:id'. Delete a link if one is found
 * with the ID received in URL, otherwise return error
 * @param {*} request 
 * @param {*} response 
 */
const deleteLink = async (request, response) => {
  // check if link with ID exists
  const link = await linkService.findByID(Number(request.params.id))
  if (!link) {
    return response.status(400).send({
      error: 'No link was found with the specified ID'
    })
  }

  try {
    await linkService.delete(Number(request.params.id))
    response.send({ status: true })
  } catch (err) {
    response.send({ status: false, error: err })
  }
}

const linkValidations = [
  body('original_link').custom(async value => {
    // empty URL will fail the validation so we don't need to add the .notEmpty() validation
    const linkIsValid = utils.validateURL(value)
    if (!linkIsValid) {
      throw new Error("Invalid link!")
    }
  }),
  body('link_code').isLength({ max: 8 })
]

linkController.post('/', linkValidations, createLink)
linkController.put('/:id', linkValidations, updateLink)
linkController.delete('/:id', deleteLink)

module.exports = linkController