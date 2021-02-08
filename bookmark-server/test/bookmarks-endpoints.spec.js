const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Bookmark Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('bookmarks_assgn').truncate())

  context('Given there are bookmarks', () => {
    const testBookmarks = [
      {
        id: 1,
        title: 'Book mark one!',
        url: 'https://www.firstBookmark.com',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
      },
      {
        id: 2,
        title: 'Book mark two!',
        url: 'https://www.secondBookmark.com',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
      },
      {
        id: 3,
        title: 'Book mark three!',
        url: 'https://www.thirdBookmark.com',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
      },
      {
        id: 4,
        title: 'Book mark four!',
        url: 'https://www.fourthBookmark.com',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
      }
    ];

    beforeEach('insert articles', () => {
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
})