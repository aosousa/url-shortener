import ApiClientData from "@/classes/ApiClientData"

const URI = import.meta.env.VITE_API_URI

/**
 * Reusable fetch wrapper for HTTP requests
 * @param {ApiClientData} clientData Data needed for a request (endpoint, method, request body)
 */
export default async function ApiClient(clientData) {

  const config = {
    method: clientData.method,
    headers: {
      ...clientData.headers
    }
  }

  if (clientData.body) {
    config.body = clientData.body
  }

  try {
    const response = await fetch(`${URI}${clientData.endpoint}`, config)
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      console.log(data.error)
      throw new Error(data.error)
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

/**
 * Send a GET request to the specified endpoint
 * @param {string} endpoint Endpoint to send request to
 * @param {object} headers Headers needed for request. Object key
 * is the header name, value is the header value 
 * 
 * (e.g., { 'Content-Type': 'application/json' })
 * 
 * @returns {Promise<any>}
 */
ApiClient.get = (endpoint, headers) => ApiClient(new ApiClientData(endpoint, 'GET', headers, null))

/**
 * Send a POST request to the specified endpoint
 * @param {string} endpoint Endpoint to send request to
 * @param {object} headers Headers needed for request. Object key
 * is the header name, value is the header value 
 * 
 * (e.g., { 'Content-Type': 'application/json' })
 * 
 * @param {object} body Request body
 * @returns {Promise<any>}
 */
ApiClient.post = (endpoint, headers, body) => ApiClient(new ApiClientData(endpoint, 'POST', headers, body))

/**
 * Send a PUT request to the specified endpoint
 * @param {string} endpoint Endpoint to send request to
 * @param {object} headers Headers needed for request. Object key
 * is the header name, value is the header value 
 * 
 * (e.g., { 'Content-Type': 'application/json' })
 * 
 * @param {object} body Request body
 * @returns {Promise<any>}
 */
ApiClient.put = (endpoint, headers, body) => ApiClient(new ApiClientData(endpoint, 'PUT', headers, body))

/**
 * Send a DELETE request to the specified endpoint
 * @param {string} endpoint Endpoint to send request to
 * @param {object} headers Headers needed for request. Object key
 * is the header name, value is the header value 
 * 
 * (e.g., { 'Content-Type': 'application/json' })
 * @returns {Promise<any>}
 */
ApiClient.delete = (endpoint, headers) => ApiClient(new ApiClientData(endpoint, 'DELETE', headers, null))
