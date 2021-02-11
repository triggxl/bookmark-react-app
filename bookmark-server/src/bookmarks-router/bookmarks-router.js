const express = require('express');
const xss = require('xss');
const BookmarksService = require('../bookmarksService')

const bookmarksRouter = express.Router();
const jsonParser = express.json(); //read the body && send json res

const serializedBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  description: xss(bookmark.description),
  url: bookmark.url,
  rating: bookmark.rating
})

bookmarksRouter
  .route('/bookmarks')
  //add db, compare serialized to 'catch'
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks.map(serializedBookmark))
      })
      .catch(next)
  })
  //check if required info matches entries
  .post(jsonParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;
    const newBookmark = { title, url, description, rating }

    for (const [key, value] of Object.entries(newBookmark))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` }
        })

    BookmarksService.insertBookmark(
      req.app.get('db'), //perform in database
      newBookmark
    )
      .then(bookmark => {
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(serializedBookmark(bookmark))
      })
      .catch(next)
  })
//why isn't this route working
bookmarksRouter
  .route(`/bookmarks/:bookmark_id`)
  .all((req, res, next) => { //handler for all https verbs
    console.log('here')
    const knexInstance = req.app.get('db')
    BookmarksService.getById(knexInstance, req.params.bookmark_id)
      .then(bookmark => {
        console.log(bookmark, 'bookmark')
        if (!bookmark) {
          return res.status(404).json({
            error: { message: `Bookmark doesn't exist` }
          })
        }
        res.json(serializedBookmark(bookmark))
      })
      .catch(next)
  })

//add delete handler for 2nd error

module.exports = bookmarksRouter;



























//Unused/older code:
// const { bookmarks } = require('../store'); //named export- 'const bookmarks...'
// const logger = require('../logger');
// bookmarksRouter
//   .route('/bookmarks')
//   .get((req, res) => res.send(bookmarks))
//     /*
// [N] Write a route handler for POST /bookmarks that accepts a JSON object representing a bookmark and adds it to the list of bookmarks after validation.
// I always receive a bookmark with undefined not received error regardless of whether I put in valid data or invalid data. For invalid data, I should see an error message about what field is invalid. For valid data, a created bookmark should be returned.
//   */
//   .post(bodyParser, (req, res) => {
//     //accepting data params from request
//     const { id, title, url, rating } = req.body;
//     console.log(req.body)
//     if(!id) {
//       logger.error(`Invalid, id: ${id}.`);
//       //ajax
//       res.status(404).send(`Invalid, id: ${id}.`);
//     }
//     else if(!title) {
//       logger.error(`Invalid, title: ${title}.`);
//       res.status(404).send({error: `Invalid, title: ${title}.`});
//     }
//     else if(!url) { 
//       logger.error(`Invalid, url: ${url}.`); 
//       res.status(404).send({error: `url: ${url} not recieved.`});
//     }
//     else if(!rating) {
//       logger.error(`Invalid, rating: ${rating}.`); 
//       res.status(404).send({error: `Invalid, rating: ${rating}.`});
//     }
//     else {
//       bookmarks.push(req.body)
//       // res.status(200).send({'Added new bookmark successfully.'}) only need to send once
//       res.json(req.body)
//     }
//   })
//   /*
//   I receive a 200 OK status and a blank response regardless of whether I look for a bookmark that exists or doesn't exist. 
//   If it doesn't exist, I should receive a 404. 
//   If it does, I should receive the bookmark record as JSON.
//   Solution: Pick valid/invalid id (use postman)
//   */
//   bookmarksRouter
//   .route('/bookmarks/:id')
//   .get((req, res) => {
//     //find()
//     const { id } = req.params;
//     const bmMatch = bookmarks.find(bm => bm.id === id)
//     if(!bmMatch) {
//       logger.Error(`Bookmark with ${id} not found.`);
//       res.status(404).send('Bookmark not found.');
//       return
//     }
//     res.json(bmMatch)
//   })
//   .delete((req, res) => {
//     //splice()
//     const { id } = req.params;
//     const parseId = parseInt(id);
//     // console.log(typeof id, bookmarks)
//     const bookmarkIndex = bookmarks.findIndex(bm => bm.id === parseId)

//     if(bookmarkIndex === -1) {
//       console.error(`Bookmark with id ${id} not found.`);
//       return res.status(400).send('Not found.')
//     }
//     bookmarks.splice(bookmarks, 1);
//     res.status(204).end();
//     })

// module.exports = bookmarksRouter;

/*
1.) establish API endpoints
2.) decide HTTP verb and action for each endpoint
3.) add in comments logic you will need to complete action(s)
4.) change client API endpoint
Did I go to the right route and did it give me the right response
check the net panel troubleshooting fetches first



Steps inside a handler:
//parms
//logic
//conditional to log error
//return res/status/send back to client
*/