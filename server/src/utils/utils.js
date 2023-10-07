const URL = require('url').URL
const { validationResult } = require('express-validator')
const utils = {}

/**
 * Generate a new character alphanumeric code of specified length 
 * to use as a link's short code
 * @param {number} length Code length
 */
utils.generateLinkCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  let counter = 0

  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
    counter += 1
  }

  return result
}

/**
 * Check if the received link is a valid URL
 * @param {string} url Link URL
 * @returns {boolean}
 */
utils.validateURL = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

module.exports = utils