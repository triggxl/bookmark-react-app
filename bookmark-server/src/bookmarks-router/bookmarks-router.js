const express = require('express');
const { bookmarks } = require('../store'); //named export- 'const bookmarks...'
const logger = require('../logger');

//This is supposed to fix the 'SyntaxError: Unexpected token o in JSON at position 1' what's your suggestion?
// const stringified = JSON.stringified(bodyParser);
// https://thisinterestsme.com/fix-unexpected-token-o-in-json/
const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => res.send(bookmarks))
  .post(bodyParser, (req, res) => {
    //accepting data params from request
    const { id, title, url, rating, description } = req.params;
    console.log(req.params)
    if(!id) {
      logger.error(`Bookmark with ${id} not found.`);
      res.status(404).send('Bookmark not found.');
    }
    else if(!title) {
      logger.error(`Bookmark with ${title} not found.`);
      res.status(404).send('Bookmark not found.');
    }
    else if(!url) { 
      logger.error(`Bookmark with ${url} not found.`); 
      res.status(404).send('Bookmark not found.');
    }
    else if(!rating) {
      logger.error(`Bookmark with ${rating} not found.`); 
      res.status(404).send('Bookmark not found.');
    }
    else if(!description) {
      logger.error(`Bookmark with ${description} not found.`); 
      res.status(404).send('Bookmark not found.');
    }
    else if(req.params) {
      bookmarks.push(req.params)
      res.status(200).send('Added new bookmark successfully.')
      res.json({ bookmarks })
    }
  })
  bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    //find()
    const { id } = req.params;
    const bmMatch = bookmarks.find(bm => bm.id === id)
    if(!bookmarks) {
      logger.Error(`Bookmark with ${id} not found.`);
      res.status(404).send('Bookmark not found.');
    }
    res.json(bmMatch)
  })
  .delete((req, res) => {
    //splice()
    const { id } = req.params;
    const parseId = parseInt(id);
    // console.log(typeof id, bookmarks)
    const bookmarkIndex = bookmarks.findIndex(bm => bm.id === parseId)

    if(bookmarkIndex === -1) {
      console.error(`Bookmark with id ${id} not found.`);
      return res.status(400).send('Not found.')
    }
    bookmarks.splice(bookmarks, 1);
    res.status(204).end();
    })

module.exports = bookmarksRouter;

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