const chai = require('chai')
const expect = chai.expect
const utils = require('../utils/utils')

chai.use(require('chai-http'))

const app = require('../app')

describe('Links endpoints', () => {
  const clientOrigin = process.env.CLIENT_ORIGIN || 'localhost:5173'
  const nonExistentID = 999999999
  const code = utils.generateLinkCode(8)
  const testLinks = []

  // always create one link before proceeding
  before((done) => {
    chai.request(app)
      .post('/links')
      .set('Content-Type', 'application/json')
      .type('json')
      .send({
        title: 'IDASO Ltd',
        original_link: 'https://www.idaso.ie/',
        link_code: `idaso-${utils.generateLinkCode(2)}`
      })
      .end((error, response) => {
        testLinks.push(response.body)
        done()
      })
  })

  // delete links that were generated during testing
  after((done) => {
    for (let i = 0; i < testLinks.length; i++) {
      chai.request(app)
        .delete(`/links/${testLinks[i].id}`)
        .end()
    }
    done()
  })

  it('redirects user to correct page based on link code', (done) => {
    chai.request(app)
      .get(`/${testLinks[0].link_code}`)
      .redirects(0)
      .end((error, response) => {
        expect(response.headers.location).to.equal(`${testLinks[0].original_link}`)
        expect(response.statusCode).to.equal(302)
        done()
      })
  })

  it(`redirects user to frontend 404 if the code doesn't exist in the database`, (done) => {
    chai.request(app)
      .get('/doesnotexist')
      .redirects(0)
      .end((error, response) => {
        expect(response.headers.location).to.equal(`${clientOrigin}/404`)
        expect(response.statusCode).to.equal(302)
        done()
      })
  })

  it('creates a link with code in request', (done) => {
    const model = {
      title: 'Formula 1',
      original_link: 'https://www.formula1.com',
      link_code: code
    }

    chai.request(app)
      .post('/links')
      .set('Content-Type', 'application/json')
      .type('json')
      .send(model)
      .end((error, response) => {
        testLinks.push(response.body)

        expect(response.statusCode).to.equal(200)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('title')
        expect(response.body.title).to.equal(model.title)
        expect(response.body).to.have.property('original_link')
        expect(response.body.original_link).to.equal(model.original_link)
        expect(response.body).to.have.property('link_code')
        expect(response.body.link_code).to.equal(model.link_code)
        expect(response.body).to.have.property('views')
        expect(response.body.views).to.equal(0)
        expect(response.body).to.have.property('created_at')
        expect(response.body.created_at).to.not.equal(null)
        expect(response.body).to.have.property('updated_at')
        expect(response.body.updated_at).to.equal(null)
        done()
      })
  })

  it('creates a link with generated code', (done) => {
    const model = {
      title: 'Formula 3',
      original_link: 'https://www.fiaformula3.com'
    }

    chai.request(app)
      .post('/links')
      .set('Content-Type', 'application/json')
      .type('json')
      .send(model)
      .end((error, response) => {
        testLinks.push(response.body)

        expect(response.statusCode).to.equal(200)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('title')
        expect(response.body.title).to.equal(model.title)
        expect(response.body).to.have.property('original_link')
        expect(response.body.original_link).to.equal(model.original_link)
        expect(response.body).to.have.property('link_code')
        expect(response.body.link_code.length).to.equal(8)
        expect(response.body).to.have.property('created_at')
        expect(response.body.created_at).to.not.equal(null)
        expect(response.body).to.have.property('updated_at')
        expect(response.body.updated_at).to.equal(null)
        done()
      })
  })

  it('returns error when creating link with missing required properties', (done) => {
    const model = {
      title: 'Formula 2',
      link_code: 'f2'
    }

    chai.request(app)
      .post('/links')
      .set('Content-Type', 'application/json')
      .type('json')
      .send(model)
      .end((error, response) => {
        expect(response.statusCode).to.equal(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('error')
        expect(response.body.error).to.equal('Invalid values in the following fields: Original Link.')
        done()
      })
  })

  it('returns error when creating a link with existing code', (done) => {
    const model = {
      title: 'Formula 1',
      original_link: 'https://www.formula1.com',
      link_code: code
    }

    chai.request(app)
      .post('/links')
      .set('Content-Type', 'application/json')
      .type('json')
      .send(model)
      .end((error, response) => {
        expect(response.statusCode).to.equal(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('error')
        expect(response.body.error).to.equal('Specified short code is already taken!')
        done()
      })
  })

  it('returns error when creating a link with link_code that has more than 8 characters', (done) => {
    const model = {
      title: 'Formula 2',
      original_link: 'https://www.fiaformula2.com',
      link_code: 'morethan8'
    }

    chai.request(app)
      .post('/links')
      .set('Content-Type', 'application/json')
      .type('json')
      .send(model)
      .end((error, response) => {
        expect(response.statusCode).to.equal(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('error')
        expect(response.body.error).to.equal('Invalid values in the following fields: Short Code.')
        done()
      })
  })

  it('returns list of links', (done) => {
    chai.request(app)
      .get('/')
      .end((error, response) => {
        expect(response.statusCode).to.equal(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.above(0)
        done()
      })
  })

  it('updates a link', (done) => {
    const model = {
      title: 'Formula 2 Update',
      link_code: 'f2update'
    }

    chai.request(app)
      .put(`/links/${testLinks[1].id}`)
      .set('Content-Type', 'application/json')
      .type('json')
      .send(model)
      .end((error, response) => {
        expect(response.statusCode).to.equal(200)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('title')
        expect(response.body.title).to.equal(model.title)
        expect(response.body).to.have.property('link_code')
        expect(response.body.link_code).to.equal(model.link_code)
        expect(response.body).to.have.property('updated_at')
        expect(response.body.updated_at).to.not.equal(null)
        done()
      })
  })

  it('returns error when updating link with missing required properties', (done) => {
    const model = {
      title: 'Formula 2 Update',
    }

    chai.request(app)
      .put(`/links/${testLinks[1].id}`)
      .set('Content-Type', 'application/json')
      .type('json')
      .send(model)
      .end((error, response) => {
        expect(response.statusCode).to.equal(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('error')
        expect(response.body.error).to.equal('Invalid values in the following fields: Short Code.')
        done()
      })
  })

  it(`returns error when trying to update link with ID that doesn't exist`, (done) => {
    const model = {
      title: 'Formula 2 Update',
      link_code: 'f2'
    }

    chai.request(app)
      .put(`/links/${nonExistentID}`)
      .set('Content-Type', 'application/json')
      .type('json')
      .send(model)
      .end((error, response) => {
        expect(response.statusCode).to.equal(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('error')
        expect(response.body.error).to.equal('No link was found with the specified ID!')
        done()
      })
  })

  it(`returns error when updating a link's code to an existing one`, (done) => {
    const model = {
      link_code: testLinks[0].link_code
    }

    chai.request(app)
      .put(`/links/${testLinks[1].id}`)
      .set('Content-Type', 'application/json')
      .type('json')
      .send(model)
      .end((error, response) => {
        expect(response.statusCode).to.equal(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('error')
        expect(response.body.error).to.equal('A link with that code already exists!')
        done()
      })
  })

  it('deletes a link', (done) => {
    chai.request(app)
      .delete(`/links/${testLinks[0].id}`)
      .end((error, response) => {
        expect(response.statusCode).to.equal(200)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('status')
        expect(response.body.status).to.equal(true)
        done()
      })
  })

  it(`returns error when trying to delete link with ID that doesn't exist`, (done) => {
    chai.request(app)
      .delete(`/links/${nonExistentID}`)
      .end((error, response) => {
        expect(response.statusCode).to.equal(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('error')
        expect(response.body.error).to.equal('No link was found with the specified ID!')
        done()
      })
  })
})