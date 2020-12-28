const express = require('express');

const cardRouter = express.Router();
const bodyParser = express.json();

cardRouter
  .route('/card')
  .get((req, res) => {res.json(cards)})
  .post((req, res) => {
    //get data from the body
    const { title, content } = req.body;
    //validate that title and content exist
    if(!title) {
      logger.error('Title is required');
      return res.status(400).send('Invalid Data');
    }
    if(!content) {
      logger.error('Content is required');
      return res.status(400).send('Invalid Data');
    }
    //if they exist generate an ID and push a card object into the array
    const id = uuid();
    const card = {
      id,
      title,
      content
    }
    cards.push(card);
    //log card creation and send a response, including location header
    logger.info(`Card with id of ${id} was created`);
    res.status(201).location(`https://localhost:8000/card/${id}`).json(card);
  })

cardRouter
  .route('/card')
  .get((req, res) => res.json(cards))
  .delete((req, res) => {
      const { id } = req.params;
      const cardIndex = cards.findIndex(c => c.id === id);
    
      if(cardIndex === -1) {
        logger.error(`Card with id ${id} not found.`);
        return res.status(400).send('Not found.');
      }
      //remove card from lists && assume cardIds are not duplicated in the cardIds
      lists.forEach(list => {
        const cardIds = list.cardIds.filter(cid => cid !== id);
        list.cardIds === cardIds;
      })
      card.splice(cardIndex, 1);
      res.status(204).end();
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
  })

  module.exports = cardRouter;
