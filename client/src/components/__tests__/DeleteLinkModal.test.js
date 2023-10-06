import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

// Components
import DeleteLinkModal from '@/components/DeleteLinkModal.vue'

// Mock Data
import { getLinksResponse } from '@/tests/mocks/mockLinks'

// Stores
import { useLinksStore } from '@/stores/links'

describe('DeleteLinkModal Component Tests', () => {
  const URI = import.meta.env.VITE_API_URI

  it(`renders the link's information in modal and calls the delete link method in store when clicking the delete link button`, async () => {
    const mockLinks = getLinksResponse
    const mockLink = mockLinks[0]
    const wrapper = mount(DeleteLinkModal, {
      global: {
        plugins: [
          // create links store with mock data
          createTestingPinia({
            initialState: {
              // name of the store
              links: {
                // properties of the store
                links: mockLinks,
                loading: false,
                error: null
              }
            },

            /**
             * createTestingPinia stubs out all store actions by default. We want 
             * to test if the deleteLink method was called with the correct data. 
             * 
             * This property reverts createTestingPinia's default behavior, and 
             * will execute the store actions on the mock data.
             */
            stubActions: false
          })
        ],

        /**
         * FontAwesomeIcon is declared as a global component in main.js, so it
         * has to be stubbed here to render correctly in the wrapper
         */
        stubs: ['FontAwesomeIcon']
      },
      props: {
        link: mockLink
      }
    })

    const store = useLinksStore()

    expect(wrapper.find('h2[data-test-id=modal-title]').text()).toEqual(`Delete Link - ${mockLink.title}`)
    expect(wrapper.find('p[data-test-id=link-description]').text()).toEqual(`${URI}/${mockLink.link_code}`)

    await wrapper.find('button[data-test-id=delete-btn]').trigger('click')

    // check if store method was called correctly
    expect(store.deleteLink).toHaveBeenCalledTimes(1)
    expect(store.deleteLink).toHaveBeenCalledWith(mockLink.id)
  })
})