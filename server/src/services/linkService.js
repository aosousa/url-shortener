const linkService = {}
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 * Get all links in the database
 * @returns {array}
 */
linkService.findAll = async () => {
  return prisma.link.findMany()
}

/**
 * Find a link by code 
 * @param {string} link_code Link code to use in query
 * @returns {object|null} Link object if one was found, null otherwise
 */
linkService.findByCode = async (code) => {
  const link = await prisma.link.findFirst({
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
linkService.findByID = async (id) => {
  const link = await prisma.link.findFirst({
    where: {
      id
    }
  })

  return link
}

/**
 * Create a new link
 * @param {object} data Data of the link to create 
 */
linkService.create = async (data) => {
  return prisma.link.create({
    data
  })
}

/**
 * Update a link by ID
 * @param {number} id Link ID
 * @param {object} data Link data to update
 */
linkService.update = async (id, data) => {
  return prisma.link.update({
    where: {
      id
    },
    data
  })
}

/**
 * Delete a link by ID
 * @param {number} id Link ID
 */
linkService.delete = async (id) => {
  return prisma.link.delete({
    where: {
      id
    }
  })
}

module.exports = linkService