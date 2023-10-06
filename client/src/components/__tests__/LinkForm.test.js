import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

// Components
import LinkForm from '@/components/LinkForm.vue'

// Mock Data
import { getLinksResponse } from '@/tests/mocks/mockLinks'

// Stores
import { useLinksStore } from '@/stores/links'

describe('LinkForm Component Tests', () => {
  it('shows error messages when trying to create a new link with empty required fields', async () => {
    const wrapper = mount(LinkForm, {
      global: {
        plugins: [
          /**
           * No initial state is needed for this test because 
           * we are trying to create a brand new link
           */
          createTestingPinia({
            /**
             * createTestingPinia stubs out all store actions by default. We want 
             * to confirm that the createLink method was not called. 
             * 
             * This property reverts createTestingPinia's default behavior, and 
             * will execute the store actions on the mock data (if there are no
             * validation errors).
             */
            stubActions: false
          })
        ],
      },
      props: {
        link: null
      }
    })

    const store = useLinksStore()

    await wrapper.find('button[data-test-id=submit-btn]').trigger('submit')

    /**
     * Check component status - error must be true and the model must
     * have empty values
     */
    expect(wrapper.vm.error).toEqual(true)
    expect(wrapper.vm.model).toEqual({
      title: '',
      original_link: '',
      link_code: ''
    })

    /**
     * Check template status - an error div should exist
     * with 'This is a required field.' message
     */
    expect(wrapper.find('div.input-error').exists()).toEqual(true)
    expect(wrapper.find('div.input-error').text()).toEqual('This is a required field.')

    // Check store status - createLink method must not have been called
    expect(store.createLink).toHaveBeenCalledTimes(0)
  })

  it('successfully submits form and calls the create method in store', async () => {
    const wrapper = mount(LinkForm, {
      global: {
        plugins: [
          /**
           * No initial state is needed for this test because 
           * we are trying to create a brand new link
           */
          createTestingPinia({
            /**
             * createTestingPinia stubs out all store actions by default. We want 
             * to confirm that the createLink method was called with the right data.
             * 
             * This property reverts createTestingPinia's default behavior, and 
             * will execute the store actions on the mock data (if there are no
             * validation errors).
             */
            stubActions: false
          })
        ],
      },
      props: {
        link: null
      }
    })

    const store = useLinksStore()
    const model = {
      title: 'Formula 1',
      original_link: 'https://www.formula1.com',
      link_code: 'f1'
    }

    await wrapper.find('input[data-test-id=original-link]').setValue(model.original_link)
    await wrapper.find('input[data-test-id=title]').setValue(model.title)
    await wrapper.find('input[data-test-id=link-code]').setValue(model.link_code)
    await wrapper.find('button[data-test-id=submit-btn]').trigger('submit')

    /**
     * Check component status - error must be false and 
     * the model must match the values above
     */
    expect(wrapper.vm.error).toEqual(false)
    expect(wrapper.vm.model).toEqual(model)

    // Check template status - no error divs must be exist
    expect(wrapper.find('div.input-error').exists()).toEqual(false)

    /**
     * Check store status - createLink method must have been
     * called once and with the model above
     */
    expect(store.createLink).toHaveBeenCalledTimes(1)
    expect(store.createLink).toHaveBeenCalledWith(model)
  })

  it('shows error messages when trying to edit a new link with empty required fields', async () => {
    const mockLinks = getLinksResponse
    const mockLink = mockLinks[0]
    const wrapper = mount(LinkForm, {
      global: {
        plugins: [
          /**
           * Initial state is needed for this test because 
           * we are trying to update an existing link
           */
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
             * to confirm that the updateLink method was not called.
             * 
             * This property reverts createTestingPinia's default behavior, and 
             * will execute the store actions on the mock data (if there are no
             * validation errors).
             */
            stubActions: false
          })
        ],
      },
      props: {
        link: mockLink
      }
    })

    const store = useLinksStore()

    await wrapper.find('input[data-test-id=original-link]').setValue('')
    await wrapper.find('button[data-test-id=submit-btn]').trigger('submit')

    /**
     * Check component status - error must be true and the model's original_link
     * property must have an empty value
     */
    expect(wrapper.vm.error).toEqual(true)
    expect(wrapper.vm.model).toEqual({
      title: mockLink.title,
      original_link: '',
      link_code: mockLink.link_code
    })

    /**
     * Check template status - an error div should exist
     * with 'This is a required field.' message
     */
    expect(wrapper.find('div.input-error').exists()).toEqual(true)
    expect(wrapper.find('div.input-error').text()).toEqual('This is a required field.')

    // Check store status - updateLink method must not have been called
    expect(store.updateLink).toHaveBeenCalledTimes(0)
  })

  it('successfully submits form and calls the update method in store', async () => {
    const mockLinks = getLinksResponse
    const mockLink = mockLinks[0]
    const wrapper = mount(LinkForm, {
      global: {
        plugins: [
          /**
           * Initial state is needed for this test because 
           * we are trying to update an existing link
           */
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
             * to confirm that the updateLink method was called with the right data.
             * 
             * This property reverts createTestingPinia's default behavior, and 
             * will execute the store actions on the mock data (if there are no
             * validation errors).
             */
            stubActions: false
          })
        ],
      },
      props: {
        link: mockLink
      }
    })

    const store = useLinksStore()
    const model = {
      title: 'IDASO Ltd.',
      original_link: 'https://www.idaso.ie',
      link_code: 'idasoltd'
    }

    await wrapper.find('input[data-test-id=original-link]').setValue(model.original_link)
    await wrapper.find('input[data-test-id=title]').setValue(model.title)
    await wrapper.find('input[data-test-id=link-code]').setValue(model.link_code)
    await wrapper.find('button[data-test-id=submit-btn]').trigger('submit')

    /**
     * Check component status - error must be false and 
     * the model must match the values above
     */
    expect(wrapper.vm.error).toEqual(false)
    expect(wrapper.vm.model).toEqual(model)

    // Check template status - no error divs must be exist
    expect(wrapper.find('div.input-error').exists()).toEqual(false)

    /**
     * Check store status - updateLink method must have been
     * called once and with mock link's ID and the model above
     */
    expect(store.updateLink).toHaveBeenCalledTimes(1)
    expect(store.updateLink).toHaveBeenCalledWith(mockLink.id, model)
  })
})