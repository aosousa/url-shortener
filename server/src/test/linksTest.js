const chai = require('chai')
const expect = chai.expect

chai.use(require('chai-http'))

const app = require('../app')

describe('Links endpoints', () => {

  // it('creates a link', (done) => {})

  it('returns error when creating link with missing required properties', (done) => {
    chai.request(app)
      .post('/')
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
      .post('/')
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'Formula 1',
        original_link: 'https://www.formula1.com',
        link_code: 'f1'
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
      .post('/')
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'Formula 2',
        original_link: 'https://www.formula2.com',
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

  it('returns error when creating a link with empty link_code', (done) => {
    chai.request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'Formula 2',
        original_link: 'https://www.formula2.com',
        link_code: ''
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('error')
        expect(res.body.error).to.equal('Invalid values in the following fields: link_code.')
        done()
      })
  })

  // it('updates a link', (done) => {})

  // it('returns error when updating link with missing required properties', (done) => {})

  // it('returns error when trying to update link with ID that doesn\'t exist', (done) => {})

  // it('returns error when updating a link's code to an existing one', (done) => {})

  // it('deletes a link', (done) => {})

  // it('returns error when trying to delete link with ID that doesn\'t exist', (done) => {})

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

  it('redirects user to correct page based on link code', (done) => {
    chai.request(app)
      .get('/f1')
      .redirects(0)
      .end((err, res) => {
        expect(res.headers.location).to.equal('https://www.formula1.com')
        expect(res.statusCode).to.equal(302)
        done()
      })
  })

  // it('redirects user to frontend 404 based on link code', (done) => { })
})