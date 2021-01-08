require('dotenv').config();
const { v4: uuid } = require('uuid');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const bookmarksRouter = require('./bookmarks-router/bookmarks-router');

const app = express();

const morganSetting = (NODE_ENV === 'production' ? 'tiny': 'common');
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
})
console.log('app1')
//auth middleware
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path:${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})
console.log('app2')

//require routers
app.use(bookmarksRouter);
console.log('app3')


app.use((error, req, res, next) => {
  let response;
  if(NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})
console.log('app4')

module.exports = app;