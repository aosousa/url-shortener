/**
 * Set up mock server to handle fake HTTP requests used to test
 * the Pinia stores
 */

import { beforeAll, afterEach, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from './handlers'
import 'whatwg-fetch'

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// close mock server after all tests have been completed
afterAll(() => server.close())

afterEach(() => {
  /**
   * The `?error=true` query param is added to tests to simulate
   * error scenarios through the handlers.
   * 
   * This resets the URL query after each test, otherwise the 
   * tests executed after error scenario tests will still include 
   * the `?error=true` query param, and tests for success scenarios
   * will not pass.
   */
  window.history.replaceState({}, '', '/')
})