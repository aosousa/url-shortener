import { defineStore } from 'pinia'

// Utils
import ApiClient from '@/utils/apiClient'
import SortUtils from '@/utils/sortUtils'

/**
 * links (array): Array of objects (link) with the following properties:
 *   id (number) - ID of the link
 *   title (string|null) - Title of the link selected by the user
 *   original_link (string) - URL to shorten
 *   link_code (string) - Shortened URL, either generated or selected 
 *     by the user
 *   views (number) - Number of successful redirects to the original
 *     link via the link_code redirect
 *   created_at (string) - Date and time when the link was created in 
 *     YYYY-MM-DDTHH:mm:ss.sssZ format
 *   updated_at (string|null) - Date and time of the last update to the 
 *     link in YYYY-MM-DDTHH:mm:ss.sssZ format. Null if no update has
 *     happened yet.
 * 
 * loading (boolean): Whether or not there is an operation underway.
 * 
 * error (string|null): Error description in case an error occurred
 *   in an operation. Null otherwise.
 */
export const useLinksStore = defineStore('links', {
  state: () => ({
    links: [],
    loading: false,
    error: null
  }),
  getters: {
    /**
     * Get a link by ID. Return null if it doesn't exist.
     * @param {number} ID ID of the link
     * @returns {object|null}
     */
    linkByID: (state) => (ID) => {
      return state.links.find((link) => link.id === ID) || null
    },

    /**
     * Sort and filter links in store through sort option and filter text
     * @param {string} sortOption Sort option 
     * @param {string} searchFilter Value in text input
     * @returns 
     */
    sortedAndFilteredLinks: (state) => (sortOption, searchFilter) => {
      let links = state.links

      if (searchFilter !== '') {
        const lowercaseSearchFilter = searchFilter.toLocaleLowerCase()
        links = links.filter((link) => link.title.toLocaleLowerCase().includes(lowercaseSearchFilter) ||
          link.original_link.toLocaleLowerCase().includes(lowercaseSearchFilter) ||
          link.link_code.toLocaleLowerCase().includes(lowercaseSearchFilter))
      }

      switch (sortOption) {
        case 'title-asc':
          links = links.sort((linkA, linkB) => SortUtils.sortByStringValue(linkA.title, linkB.title, 'asc'))
          break

        case 'title-desc':
          links = links.sort((linkA, linkB) => SortUtils.sortByStringValue(linkA.title, linkB.title, 'desc'))
          break

        case 'views-asc':
          links = links.sort((linkA, linkB) => SortUtils.sortByNumericValue(linkA.views, linkB.views, 'asc'))
          break

        case 'views-desc':
          links = links.sort((linkA, linkB) => SortUtils.sortByNumericValue(linkA.views, linkB.views, 'desc'))
          break

        case 'created-at-asc':
          links = links.sort((linkA, linkB) => SortUtils.sortByStringValue(linkA.created_at, linkB.created_at, 'asc'))
          break

        case 'created-at-desc':
          links = links.sort((linkA, linkB) => SortUtils.sortByStringValue(linkA.created_at, linkB.created_at, 'desc'))
          break
      }

      return links
    }
  },
  actions: {
    /**
     * Load all links in the database and save to state
     */
    async getLinks() {
      this.loading = true
      this.error = null

      try {
        const headers = {
          'Content-Type': 'application/json'
        }

        const response = await ApiClient.get('/links', headers)
        this.links = response
        this.loading = false
      } catch (error) {
        console.error(`Failed to load links: ${error.message}`)
        this.loading = false
        this.error = error.message
      }
    },

    /**
     * Get the title of a page through its URL. As this is an
     * operation that will run in the background after a user
     * is finished typing the original link while creating a 
     * new link, the loading and error states are not changed.
     * @param {string} url Page's full URL (https://...)
     * @returns {Promise<string>} 
     */
    async getPageTitle(url) {  
        try {
          const headers = {
            'Content-Type': 'application/json'
          }
    
          const response = await ApiClient.get(`/?url=${url}`, headers)
          return response.title
        } catch (error) {
          console.error(`Failed to get page title: ${error.message}`)
          return ''
        }
    },

    /**
     * Create a new link
     * @param {object} model Link data. Should have title, 
     * original_link, and link_code properties.
     * @returns {Promise<bool>}
     */
    async createLink(model) {
      this.loading = true
      this.error = null

      try {
        const headers = {
          'Content-Type': 'application/json'
        }

        const body = JSON.stringify(model)

        const response = await ApiClient.post('/links', headers, body)
        this.links.push(response)
        this.loading = false

        return true
      } catch (error) {
        console.error(`Failed to create link: ${error.message}`)
        this.loading = false
        this.error = error.message
        return false
      }
    },

    /**
     * Update an existing link
     * @param {number} ID ID of the link
     * @param {object} model Link data. Should have title and 
     * link_code properties.
     * @returns {Promise<bool>}
     */
    async updateLink(ID, model) {
      this.loading = true
      this.error = null

      try {
        const headers = {
          'Content-Type': 'application/json'
        }

        const body = JSON.stringify(model)

        const response = await ApiClient.put(`/links/${ID}`, headers, body)
        const link = this.linkByID(ID)
        if (link) {
          link.title = response.title
          link.link_code = response.link_code
          link.updated_at = response.updated_at
        }

        this.loading = false
        return true
      } catch (error) {
        console.error(`Failed to update link: ${error.message}`)
        this.loading = false
        this.error = error.message
        return false
      }
    },

    /**
     * Delete an existing link
     * @param {number} ID ID of the link
     * @returns {Promise<bool>}
     */
    async deleteLink(ID) {
      this.loading = true
      this.error = null

      try {
        const headers = {
          'Content-Type': 'application/json'
        }

        const response = await ApiClient.delete(`/links/${ID}`, headers)
        if (response.status) {
          this.links = this.links.filter((link) => link.id !== ID)
        }

        this.loading = false
        return true
      } catch (error) {
        console.error(`Failed to delete link: ${error.message}`)
        this.loading = false
        this.error = error.message
        return false
      }
    }
  }
})