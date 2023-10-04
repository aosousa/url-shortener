const linkService = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Find a link by code 
 * @param {string} link_code Link code to use in query
 * @returns {object|null} Link object if one was found, null otherwise
 */
linkService.findLinkByCode = async (code) => {
  const link = await prisma.link.findUnique({
    where: {
      link_code: code
    }
  })

  return link
}

/**
 * Find a link by ID
 * @param {number} id Link ID
 * @returns {object|null} Link object if one was found, null otherwise
 */
linkService.findLinkByID = async (id) => {
  const link = await prisma.link.findUnique({
    where: {
      id
    }
  })

  return link
}

/**
 * Update a link by ID
 * @param {number} id Link ID
 * @param {object} data Link data to update
 */
linkService.updateLink = async (id, data) => {
  await prisma.link.update({
    where: {
      id
    },
    data
  })
}

module.exports = linkService