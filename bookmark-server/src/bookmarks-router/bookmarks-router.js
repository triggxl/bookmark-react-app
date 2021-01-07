const express = require('express');
const { bookmarks } = require('../store'); //named export- 'const bookmarks...'

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => res.send(bookmarks))
  .post(bodyParser, (req, res) => {
    //accepts a JSON object representing a bookmark and adds it to the list of bookmarks after validation
    //push()
    const { id, title, url, rating, desc } = req.params;
    if(!id) {
      logger.Error(`Bookmark with ${id} not found.`);
      res.status(404).send('Bookmark not found.');
    }
    if(!title) {
      logger.Error(`Bookmark with ${title} not found.`);
      res.status(404).send('Bookmark not found.');
    }
    if(!url) { 
      logger.Error(`Bookmark with ${url} not found.`); 
      res.status(404).send('Bookmark not found.');
    }
    if(!rating) {
      logger.Error(`Bookmark with ${rating} not found.`); 
      res.status(404).send('Bookmark not found.');
    }
    if(!desc) {
      logger.Error(`Bookmark with ${desc} not found.`); 
      res.status(404).send('Bookmark not found.');
    }
    if(req.params) {
      bookmarks.push(req.params)
      res.status(200).send('Added new bookmark successfully.')
    }
    res.json({ bookmarks })
  })
  .route('/bookmarks/:id')
  .get((req, res) => {
    //find()
    const { id } = req.params;
    bookmarks.find(bm => bm.id === id)
    if(!bookmarks) {
      logger.Error(`Bookmark with ${id} not found.`);
      res.status(404).send('Bookmark not found.');
    }
    res.json(bookmarks)
  })
  .delete((req, res) => {
    //splice()
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(bm => bm.id === id)

    if(bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res.status(400).send('Not found.')
    }
    bookmarkIndex.splice(bookmarkIndex, 1);
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