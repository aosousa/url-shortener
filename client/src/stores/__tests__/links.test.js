// Core
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// Mock Responses
import {
  getLinksResponse,
  createLinkRequest,
  createLinkSuccessResponse,
  createLinkErrorResponse,
  updateLinkRequest,
  updateLinkSuccessResponse,
  updateLinkErrorResponse,
  deleteLinkErrorResponse
} from '@/tests/mocks/mockLinks'

// Stores
import { useLinksStore } from '@/stores/links'

describe('Stores Data Store Test', () => {
  let store = null

  // set active store before running the tests
  beforeAll(() => {
    setActivePinia(createPinia())

    store = useLinksStore()
  })

  /**
   * reset store data after each call to be able to
   * test error scenarios with the same mock data
   */
  afterEach(() => {
    store.links = []
    store.loading = false
    store.error = null
  })

  it('initializes store with correct values', () => {
    expect(store.links.length).toEqual(0)
    expect(store.loading).toEqual(false)
    expect(store.error).toEqual(null)
  })

  it('loads links data', async () => {
    await store.getLinks()

    expect(store.links).toEqual(getLinksResponse)
  })

  it('gets a link by ID', async () => {
    await store.getLinks()

    const link = store.linkByID(getLinksResponse[0].id)
    expect(link).not.toEqual(null)
  })

  it('returns null when link with ID does not exist', async () => {
    await store.getLinks()

    const link = store.linkByID(9999999)
    expect(link).toEqual(null)
  })

  it('creates a link and adds it to state', async () => {
    await store.createLink(createLinkRequest)

    const newLink = store.linkByID(createLinkSuccessResponse.id)
    expect(newLink).not.toEqual(null)
    expect(store.loading).toEqual(false)
    expect(store.error).toEqual(null)
  })

  it('does not create a link when the request fails', async () => {
    /**
     * add `?error=true` to URI to receive a mock error 
     * response and test an error scenario
     */
    window.history.replaceState({}, '', '/?error=true')

    await store.createLink({
      title: 'Error Scenario',
      link_code: 'error'
    })

    const newLink = store.linkByID(createLinkSuccessResponse.id)
    expect(newLink).toEqual(null)
    expect(store.loading).toEqual(false)
    expect(store.error).toEqual(createLinkErrorResponse.error)
  })

  it('updates a link', async () => {
    await store.getLinks()
    await store.updateLink(store.links[0].id, updateLinkRequest)

    const updatedLink = store.linkByID(store.links[0].id)
    expect(updatedLink).not.toEqual(null)
    expect(updatedLink.title).toEqual(updateLinkSuccessResponse.title)
    expect(updatedLink.link_code).toEqual(updateLinkSuccessResponse.link_code)
    expect(updatedLink.updated_at).toEqual(updateLinkSuccessResponse.updated_at)
    expect(store.loading).toEqual(false)
    expect(store.error).toEqual(null)
  })

  it('does not update a link when the request fails', async () => {
    /**
     * add `?error=true` to URI to receive a mock error 
     * response and test an error scenario
     */
    window.history.replaceState({}, '', '/?error=true')

    await store.getLinks()
    await store.updateLink(store.links[0].id, updateLinkRequest)

    const updatedLink = store.linkByID(store.links[0].id)
    expect(updatedLink).not.toEqual(null)
    expect(updatedLink.title).not.toEqual(updateLinkSuccessResponse.title)
    expect(updatedLink.link_code).not.toEqual(updateLinkSuccessResponse.link_code)
    expect(updatedLink.updated_at).not.toEqual(updateLinkSuccessResponse.updated_at)
    expect(store.loading).toEqual(false)
    expect(store.error).toEqual(updateLinkErrorResponse.error)
  })

  it('deletes a link', async () => {
    await store.getLinks()

    const linkID = store.links[0].id

    await store.deleteLink(linkID)
    const deletedLink = store.linkByID(linkID)
    expect(deletedLink).toEqual(null)
    expect(store.loading).toEqual(false)
    expect(store.error).toEqual(null)
  })

  it('does not delete a link when the request fails', async () => {
    /**
     * add `?error=true` to URI to receive a mock error 
     * response and test an error scenario
     */
    window.history.replaceState({}, '', '/?error=true')

    await store.getLinks()
    await store.deleteLink(store.links[0].id)

    const deletedLink = store.linkByID(store.links[0].id)
    expect(deletedLink)
    expect(store.loading).toEqual(false)
    expect(store.error).toEqual(deleteLinkErrorResponse.error)
  })
})