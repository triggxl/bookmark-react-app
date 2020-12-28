require('dotenv').config();
const { v4: uuid } = require('uuid');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const cardRouter = require('./card/card-router');
const listRouter = require('./list/list-router');

const app = express();

const morganSetting = (NODE_ENV === 'production' ? 'tiny': 'common');
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
})
//auth middleware
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path:${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

//require routers
app.use(cardRouter);
app.use(listRouter);

app.use((error, req, res, next) => {
  let response;
  if(NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

module.exports = app;