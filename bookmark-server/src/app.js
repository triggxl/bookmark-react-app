require('dotenv').config();
const { v4: uuid } = require('uuid');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const BookmarksService = require('./bookmarksService')
const bookmarksRouter = require('./bookmarks-router/bookmarks-router');
const logger = require('./logger');

const app = express();


const morganSetting = (NODE_ENV === 'production' ? 'tiny' : 'common');
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/bookmarks', (req, res, next) => {
  BookmarksService.getAllBookmarks(req.app.get('db'))
    .then(bookmark => {
      res.json(bookmark)
    })
    .catch(next)
})

app.get('/', (req, res) => {
  res.send('Hello, world!');
})
//auth middleware
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  //added header called 'Authorization' get/set header "let's get the auth header"
  const authToken = req.get('Authorization')
  // see if client's key matches the server's token
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    console.log(authToken, apiToken)
    logger.error(`Unauthorized request to path:${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})

//require routers
app.use('/api/bookmarks', bookmarksRouter);


app.use((error, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    response = { error }
  }
  res.status(500).json(response)
  logger.error(error)
  console.error(error)
})

module.exports = app;

