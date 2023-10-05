import { rest } from 'msw'

// Mock Responses
import {
  getLinksResponse,
  createLinkSuccessResponse,
  createLinkErrorResponse,
  updateLinkSuccessResponse,
  updateLinkErrorResponse,
  deleteLinkSuccessResponse,
  deleteLinkErrorResponse
} from './mocks/mockLinks'

const URI = import.meta.env.VITE_API_URI

/**
 * Define mock responses for success and error scenarios when
 * calling the endpoints used in the Pinia store
 */
export const handlers = [
  // Mock call to GET / endpoint
  rest.get(`${URI}/`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(getLinksResponse))
  }),

  // Mock call to POST /links
  rest.post(`${URI}/links`, (req, res, ctx) => {
    /**
     * check if `?error=true` query param exists to mock an error 
     * response from the API
     */
    const pageParams = new URLSearchParams(window.location.search)
    const mockError = pageParams.get('error') === 'true'

    if (mockError) {
      return res(ctx.status(400), ctx.json(createLinkErrorResponse))
    } else {
      return res(ctx.status(200), ctx.json(createLinkSuccessResponse))
    }
  }),

  // Mock call to PUT /links/:id
  rest.put(`${URI}/links/:id`, (req, res, ctx) => {
    /**
     * check if `?error=true` query param exists to mock an error 
     * response from the API
     */
    const pageParams = new URLSearchParams(window.location.search)
    const mockError = pageParams.get('error') === 'true'

    if (mockError) {
      return res(ctx.status(400), ctx.json(updateLinkErrorResponse))
    } else {
      return res(ctx.status(200), ctx.json(updateLinkSuccessResponse))
    }
  }),

  // Mock call to DELETE /links/:id
  rest.delete(`${URI}/links/:id`, (req, res, ctx) => {
    /**
     * check if `?error=true` query param exists to mock an error 
     * response from the API
     */
    const pageParams = new URLSearchParams(window.location.search)
    const mockError = pageParams.get('error') === 'true'

    if (mockError) {
      return res(ctx.status(400), ctx.json(deleteLinkErrorResponse))
    } else {
      return res(ctx.status(200), ctx.json(deleteLinkSuccessResponse))
    }
  })
]