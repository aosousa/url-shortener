const chai = require('chai')
const expect = chai.expect
const utils = require('../utils/utils')

chai.use(require('chai-http'))

const app = require('../app')

describe('Links endpoints', () => {
  let firstLink = null
  let nonExistentID = 999999999
  const code = utils.generateLinkCode(8)
  const deleteIDs = []

  // always create one link before proceeding
  before(() => {
    chai.request(app)
      .post('/links')
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'IDASO Ltd',
        original_link: 'https://www.idaso.ie/',
        link_code: 'idaso'
      })
      .end((err, res) => {
        firstLink = res.body
      })
  })

  // delete links that were generated during testing
  after(() => {
    for (let i = 0; i < deleteIDs.length; i++) {
      chai.request(app)
        .delete(`/links/${deleteIDs[i]}`)
        .end()
    }
  })

  it('creates a link with code in request', (done) => {
    chai.request(app)
      .post('/links')
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'Formula 1',
        original_link: 'https://www.formula1.com',
        link_code: code
      })
      .end((err, res) => {
        deleteIDs.push(res.body.id)

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('title')
        expect(res.body.title).to.equal('Formula 1')
        expect(res.body).to.have.property('original_link')
        expect(res.body.original_link).to.equal('https://www.formula1.com')
        expect(res.body).to.have.property('link_code')
        expect(res.body.link_code).to.equal(code)
        expect(res.body).to.have.property('views')
        expect(res.body.views).to.equal(0)
        done()
      })
  })

  it('creates a link with generated code', (done) => {
    chai.request(app)
      .post('/links')
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'Formula 3',
        original_link: 'https://www.fiaformula3.com'
      })
      .end((err, res) => {
        deleteIDs.push(res.body.id)

        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('title')
        expect(res.body.title).to.equal('Formula 3')
        expect(res.body).to.have.property('original_link')
        expect(res.body.original_link).to.equal('https://www.fiaformula3.com')
        expect(res.body).to.have.property('link_code')
        expect(res.body.link_code.length).to.equal(8)
        done()
      })
  })

  it('returns error when creating link with missing required properties', (done) => {
    chai.request(app)
      .post('/links')
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'Formula 2',
        link_code: 'f2'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.equal('Invalid values in the following fields: original_link.')
        done()
      })
  })

  it('returns error when creating a link with existing code', (done) => {
    chai.request(app)
      .post('/links')
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'Formula 1',
        original_link: 'https://www.formula1.com',
        link_code: code
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.equal('Specified code is already taken!')
        done()
      })
  })

  it('returns error when creating a link with link_code that has more than 8 characters', (done) => {
    chai.request(app)
      .post('/links')
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'Formula 2',
        original_link: 'https://www.fiaformula2.com',
        link_code: 'morethan8'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.equal('Invalid values in the following fields: link_code.')
        done()
      })
  })

  it('returns list of links', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array')
        expect(res.body.length).to.be.above(0)
        done()
      })
  })

  // it('updates a link', (done) => {})

  it('returns error when updating link with missing required properties', (done) => {
    chai.request(app)
      .put(`/links/${firstLink.id}`)
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'Formula 2',
        original_link: 'https://www.fiaformula2.com'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.equal('Invalid values in the following fields: link_code.')
        done()
      })
  })

  it('returns error when trying to update link with ID that doesn\'t exist', (done) => {
    chai.request(app)
      .put(`/links/${nonExistentID}`)
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'Formula 2',
        original_link: 'https://www.fiaformula2.com',
        link_code: 'f2'
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.equal('No link was found with the specified ID')
        done()
      })
  })

  it('returns error when updating a link\'s code to an existing one', (done) => {
    chai.request(app)
      .put(`/links/${firstLink.id}`)
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'Formula 2',
        original_link: 'https://www.fiaformula2.com',
        link_code: firstLink.link_code
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.equal('No link was found with the specified ID')
        done()
      })
  })

  it('redirects user to correct page based on link code', (done) => {
    chai.request(app)
      .get(`/${firstLink.link_code}`)
      .redirects(0)
      .end((err, res) => {
        expect(res.headers.location).to.equal(`${firstLink.original_link}`)
        expect(res.statusCode).to.equal(302)
        done()
      })
  })

  // it('redirects user to frontend 404 based on link code', (done) => { })

  it('deletes a link', (done) => {
    chai.request(app)
      .delete(`/links/${firstLink.id}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('status')
        expect(res.body.status).to.equal(true)
        done()
      })
  })

  it('returns error when trying to delete link with ID that doesn\'t exist', (done) => {
    chai.request(app)
      .delete(`/links/${nonExistentID}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.equal('No link was found with the specified ID')
        done()
      })
  })
})