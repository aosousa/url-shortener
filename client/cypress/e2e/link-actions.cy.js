describe('Test Link CRUD Actions', () => {
  const linksTabSelector = 'button[data-test-id=links-tab]'
  const addLinkButtonSelector = 'button[data-test-id=add-link-tab]'
  const searchFilterSelector = 'input[data-test-id=search-filter]'

  const linkTitleSelector = 'p[data-test-id=link-title]'
  const linkCodeSelector = 'a[data-test-id=link-code]'
  const linkOriginalLinkSelector = 'a[data-test-id=link-original-link]'

  const editLinkSelector = 'svg[data-test-id=edit-link-btn]'
  const deleteLinkSelector = 'svg[data-test-id=delete-link-btn]'

  const inputOriginalLinkSelector = 'input[data-test-id=original-link]'
  const inputTitleSelector = 'input[data-test-id=title]'
  const inputLinkCodeSelector = 'input[data-test-id=link-code]'
  const storeErrorSelector = 'p[data-test-id=store-error]'
  const inputErrorSelector = 'p.input-error'

  const submitButtonSelector = 'button[data-test-id=submit-btn]'
  const cancelButtonSelector = 'button[data-test-id=cancel-btn]'

  const modalSelector = 'div[data-test-id=modal]'
  const modalHeaderTitleSelector = 'h2[data-test-id=modal-title]'
  const modalDeleteLinkButtonSelector = 'button[data-test-id=delete-btn]'

  beforeEach(() => {
    cy.visit('/')
  })

  it('creates a new link with a custom short code', () => {
    cy.get(addLinkButtonSelector).click()
    cy.get(addLinkButtonSelector).should('have.class', 'active-tab')

    const linkModel = {
      title: 'GAA News',
      original_link: 'https://www.gaa.ie',
      link_code: 'gaanews'
    }

    // fill out the form inputs
    cy.get(inputOriginalLinkSelector).type(linkModel.original_link)
    cy.get(inputTitleSelector).type(linkModel.title)
    cy.get(inputLinkCodeSelector).type(linkModel.link_code)
    cy.get(submitButtonSelector).click()

    // verify that there the information saved is visible in the list of links in the links tab
    cy.get(linksTabSelector).should('have.class', 'active-tab')
    cy.get(linkTitleSelector).contains(linkModel.title).should('be.visible')
    cy.get(linkOriginalLinkSelector).contains(linkModel.original_link).should('be.visible')
    cy.get(linkCodeSelector).contains(linkModel.link_code).should('be.visible')
  })

  it('returns error when trying to create a new link with a duplicate short code', () => {
    cy.get(addLinkButtonSelector).click()
    cy.get(addLinkButtonSelector).should('have.class', 'active-tab')

    const linkModel = {
      title: 'GAA Fixtures and Results',
      original_link: 'https://www.gaa.ie/fixtures-results/',
      link_code: 'gaanews'
    }

    // fill out the form inputs
    cy.get(inputOriginalLinkSelector).type(linkModel.original_link)
    cy.get(inputTitleSelector).type(linkModel.title)
    cy.get(inputLinkCodeSelector).type(linkModel.link_code)
    cy.get(submitButtonSelector).click()

    /**
     * verify that the input error was shown and that the user is still
     * in the add link tab (which means no redirection occurred)
     */
    cy.get(storeErrorSelector).should('be.visible')
    cy.get(addLinkButtonSelector).should('have.class', 'active-tab')
  })

  it('goes back to home page on canceling the creation of a new link', () => {
    cy.get(addLinkButtonSelector).click()
    cy.get(addLinkButtonSelector).should('have.class', 'active-tab')

    cy.get(cancelButtonSelector).click()
    cy.get(linksTabSelector).should('have.class', 'active-tab')
  })

  it('visits a link through the short code', () => {
    // get the original link to compare after performing redirect
    cy.get(linkOriginalLinkSelector).first().then((link) => {
      const linkText = link.text()
      /**
       * Cypress does not allow opening a new browser tab.
       * By removing the <a>'s target attribute, we can open
       * the link in the current tab, and verify that the URL
       * is correct.
       */
      cy.get(linkCodeSelector).first().invoke('removeAttr', 'target').click()
      cy.origin(linkText, { args: { linkText } }, ({ linkText }) => {
        cy.url().should('contain', linkText)
      })
    })
  })

  it('shows links with filtered text', () => {
    const searchText = 'GAA'

    cy.get(searchFilterSelector).type(searchText)
    cy.get(linkTitleSelector).contains(searchText).should('exist')
  })

  it('shows message when there are no links for the selected filter', () => {
    cy.get(searchFilterSelector).type('no items with this text')
    cy.contains('No links available.').should('exist')
  })

  it('updates a link', () => {
    cy.get(editLinkSelector).first().click()

    cy.get(inputTitleSelector).clear()
    cy.get(inputTitleSelector).type('Cypress Title')
    cy.get(submitButtonSelector).click()
    cy.get(linkTitleSelector).contains('Cypress Title').should('be.visible')
  })

  it('returns error when trying to remove the code of a link', () => {
    cy.get(editLinkSelector).first().click()

    cy.get(inputLinkCodeSelector).clear()
    cy.get(submitButtonSelector).click()

    cy.get(inputErrorSelector).should('be.visible')
  })

  it('goes back to home page on canceling the update of a link', () => {
    cy.get(editLinkSelector).first().click()
    cy.get('h2').contains('Edit Link').should('be.visible')

    cy.get(cancelButtonSelector).click()
    cy.get(linksTabSelector).should('have.class', 'active-tab')
  })

  it('deletes a link', () => {
    cy.get(linkTitleSelector).first().then((title) => {
      const linkTitle = title.text()

      cy.get(deleteLinkSelector).first().click()
      cy.get(modalSelector).should('be.visible')
      cy.get(modalHeaderTitleSelector).contains('Delete Link').should('be.visible')

      cy.get(modalDeleteLinkButtonSelector).click()
      cy.get(modalSelector).should('not.exist')
      cy.contains(linkTitle).should('not.exist')
    })

  })

  it('closes modal on clicking the cancel button', () => {
    cy.get(deleteLinkSelector).first().click()
    cy.get(modalSelector).should('be.visible')
    cy.get(modalHeaderTitleSelector).contains('Delete Link').should('be.visible')

    cy.get(cancelButtonSelector).click()
    cy.get(modalSelector).should('not.exist')
  })
})