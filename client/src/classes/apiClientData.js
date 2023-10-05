export default class ApiClientData {
  /**
   * Create ApiClientData instance that is used in API Client utility
   * @param {string} endpoint API endpoint URI
   * @param {string} method HTTP method ('GET', 'POST', 'PUT', 'DELETE')
   * @param {object} headers Any extra headers that might be needed
   * @param {object|null} body Request body
   */
  constructor(endpoint, method, headers, body) {
    this.endpoint = endpoint
    this.method = method
    this.headers = headers
    this.body = body
  }
}