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
          .get(`/api/bookmarks`)
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
        .get('/api/bookmarks')
        .expect(200, testBookmarks)
    })
  })

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
        .post('/api/bookmarks')
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
            .get(`/api/bookmarks/${res.body.id}`)
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
          .post(`/api/bookmarks`)
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
      .post(`/api/bookmarks`)
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
          .delete(`/api/bookmarks/${bookmarkId}`)
          .set('Authorization', `Bearer: ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: `Bookmark doesn't exist` } })
      })
    })

    descibe.only(`PATCH /api/bookmarks/:bookmark:id`, () => {
      context(`Given no bookmarks`, () => {
        it(`responds with 404`, () => {
          const bookmarkId = 123456;
          return supertest(app)
            .patch(`/api/bookmarks/${bookmarkId}`)
            .expect(404, { error: { message: `Bookmark doesn't exist` } })
        })
      })
      context(`Given there are bookmarks`, () => {
        const testBookmarks = makeBookmarksArray()
        beforeEach(`insert bookmarks`, () => {
          return db
            .into(`bookmarks`)
            .insert(testBookmarks)
        })
        it(`responds with 204 and updated bookmark`, () => {
          const idToUpdate = 2;
          const updateBookmark = {
            title: `updated bookmark title`,
            url: `updatedUrl.com`,
            rating: 5,
            description: `updated article description`
          }
          const expectedBookmark = {
            ...testBookmarks[idToUpdate - 1],
            ...updateBookmark
          }
          return supertest(app)
            .patch(`/api/bookmarks/${bookmarkId}`)
            .send(updateBookmark)
            .expect(204)
            .then(res => {
              supertest(app)
                .get(`/api/bookmarks/${idToUpdate}`)
                .expect(expectedBookmark)
            })
        })
        it(`responds with 400 when no required fields supplied`, () => {
          const idToUpdate = 2;
          return supertest(app)
            .patch(`/api/bookmarks/${idToUpdate}`)
            .send({ irrelevantField: 'foo' })
            .expect(400, {
              error: {
                message: `Request body must contain either 'title', 'url', and 'rating'`
              }
            })
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
            .delete(`/api/bookmarks/${idToRemove}`)
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
})

// pseudocode
/*
it(`description`, () => {
  return run supertest
  require endpoint
  expect(status, result)
})
*/