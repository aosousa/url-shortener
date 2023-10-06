import { mount } from '@vue/test-utils'
import { describe, expect, it, vitest } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import dayjs from 'dayjs'

// Components
import LinkItem from '@/components/LinkItem.vue'

// Mock Data
import { getLinksResponse } from '../../tests/mocks/mockLinks'

describe('LinkItem Component Tests', () => {
  const URI = import.meta.env.VITE_API_URI

  /**
   * Add vitest spy function to make the navigator.clipboard.writeText
   * method available in the tests below
   */
  Object.assign(navigator, {
    clipboard: {
      writeText: vitest.fn(),
    },
  });

  it('renders the correct information of a link with all its properties set', async () => {
    const mockLinks = getLinksResponse
    const mockLink = mockLinks[0]
    const mockLinkCreatedAt = dayjs(mockLink.created_at).format('DD MMM YYYY HH:mm:ss')
    const mockLinkUpdatedAt = mockLink.updated_at ? dayjs(mockLink.updated_at).format('DD MMM YYYY HH:mm:ss') : '-'

    const wrapper = mount(LinkItem, {
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

    expect(wrapper.find('p[data-test-id=link-title]').text()).toEqual(mockLink.title)
    expect(wrapper.find('p[data-test-id=link-code]').text()).toEqual(`${URI}/${mockLink.link_code}`)
    expect(wrapper.find('a[data-test-id=link-original-link]').text()).toEqual(mockLink.original_link)
    expect(wrapper.find('p[data-test-id=link-views]').text()).toEqual(`Visited ${mockLink.views} ${mockLink.views === 1 ? 'time' : 'times'}`)
    expect(wrapper.find('p[data-test-id=link-created-at]').text()).toEqual(mockLinkCreatedAt)
    expect(wrapper.find('p[data-test-id=link-updated-at]').text()).toEqual(mockLinkUpdatedAt)

    await wrapper.find('font-awesome-icon-stub[icon=fa-clipboard]').trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${URI}/${mockLink.link_code}`);
  })

  it('renders the correct information of a link without values in the optional properties', async () => {
    const mockLinks = getLinksResponse
    const mockLink = mockLinks[2]
    const mockLinkCreatedAt = dayjs(mockLink.created_at).format('DD MMM YYYY HH:mm:ss')

    const wrapper = mount(LinkItem, {
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

    expect(wrapper.find('p[data-test-id=link-title]').text()).toEqual('-')
    expect(wrapper.find('p[data-test-id=link-code]').text()).toEqual(`${URI}/${mockLink.link_code}`)
    expect(wrapper.find('a[data-test-id=link-original-link]').text()).toEqual(mockLink.original_link)
    expect(wrapper.find('p[data-test-id=link-views]').text()).toEqual(`Visited ${mockLink.views} ${mockLink.views === 1 ? 'time' : 'times'}`)
    expect(wrapper.find('p[data-test-id=link-created-at]').text()).toEqual(mockLinkCreatedAt)
    expect(wrapper.find('p[data-test-id=link-updated-at]').text()).toEqual('-')

    await wrapper.find('font-awesome-icon-stub[icon=fa-clipboard]').trigger('click')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`${URI}/${mockLink.link_code}`);
  })
})