const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeBookmarksArray } = require('./bookmarks.fixtures');


describe('Bookmark Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('bookmarks').truncate())

  describe(`GET /bookmarks`, () => {
    context('Given no bookmarks', () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get(`/bookmarks`)
          .expect(200, [])
      })
    })
  })

  context('Given there are bookmarks', () => {

    const testBookmarks = makeBookmarksArray()

    beforeEach('insert bookmarks', () => {
      return db
        .into('bookmarks')
        .insert(testBookmarks)
    })

    it('GET /bookmarks responds with 200 and all of the bookmarks', () => {
      return supertest(app)
        .get('/bookmarks')
        .expect(200, testBookmarks)
    })
  })
  /*
  it(`description`, () => {
    return run supertest
    require endpoint
    expect(status, result)
  })
  */

  describe(`POST /bookmarks`, () => {
    it(`creates a bookmark, responding with a 201 and the new bookmark`, () => {
      this.retries(3)
      const newBookmark = {
        title: 'Test, new bookmark',
        url: 'http://testBookmarkSite.com',
        description: 'Test, new bookmark description...',
        rating: `'Example rating: '5'`
      }
      return supertest(app)
        .post('/bookmarks')
        .set('Authorization', `Bearer: ${process.env.API_TOKEN}`)
        .send(newBookmark)
        .expect(201)
        .expect(res => {
          expect(res.body.id).to.have.property('id')
          expect(res.body.title).to.eql(newBookmark.title)
          expect(res.body.url).to.eql(newBookmark.url)
          expect(res.body.description).to.eql(newBookmark.description)
          expect(res.body.rating).to.eql(newBookmark.rating)
          expect(res.headers.location).to.eql(`/bookmarks/${res.body.id}`)
        })
        .then(res =>
          supertest(app)
            .get(`/bookmarks/${res.body.id}`)
            .expect(res.body)
        )
    })
  })

  it(`POST /bookmarks validates each bookmark to have the required fields in valid formats ie: rating should be a # between 1-5`, () => {
    const requiredFields = ['title', 'url', 'description', 'rating']

    requiredFields.forEach(field => {
      const newBookmark = {
        title: 'Test, new bookmark',
        url: 'http://testBookmarkSite.com',
        description: 'Test, new bookmark description...',
        rating: 5
      }
      it(`responds with 400 and an error message when the ${field} is missing`, () => {
        delete newBookmark[field]
        return supertest(app)
          .post(`/bookmarks`)
          .send(newBookmark)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })
  })
  it('removes XSS attack content from response', () => {
    const { maliciousBookmark, expectedBookmark } = makeMaliciousBookmark()
    return supertest(app)
      .post(`bookmarks`)
      .send(maliciousBookmark)
      .expect(201)
      .expect(res => {
        expect(res.body.title).to.eql(expectedBookmark.title)
        expect(res.body.description).to.eql(expectedBookmark.description)
      })
  })
  describe(`DELETE /bookmarks/:bookmark_id`, () => {
    context(`Given no bookmarks`, () => {
      it(`responds with 404`, () => {
        const bookmarkId = 1234;
        return supertest(app)
          .delete(`/bookmarks/${bookmarkId}`)
          .set('Authorization', `Bearer: ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: `Bookmark doesn't exist` } })
      })
    })

    context(`Given there are bookmarks in the database`, () => {
      const testBookmarks = makeBookmarksArray();
      beforeEach(`insert bookmarks`, () => {
        return db
          .truncate(`bookmarks`)
          .then(() => {
            return db
              .into('bookmarks')
              .insert(testBookmarks)
          })
      })

      it(`responds with 204 and removes the bookmark`, () => {
        const idToRemove = 3;
        const expectedBookmark = testBookmarks.filter(bookmark => bookmark.id !== idToRemove)
        return supertest(app)
          .delete(`bookmarks/${idToRemove}`)
          .expect(204)
          .set('Authorization', `Bearer: ${process.env.API_TOKEN}`)
          .then(res =>
            supertest(app)
              .get(`/bookmarks`)
              .expect(expectedBookmark)
          )
      })
    })
  })
})