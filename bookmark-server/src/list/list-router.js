express = require('express');

const listRouter = express.Router();
const bodyParser = express.json();

listRouter
  .route('/list')
  .get((req, res) => res.json(lists))
  .post(bodyParser, (req, res) => {
    const { header, cardIds = [] } = req.body;

    if(!header) {
      logger.error('Header is required')
      return res.status(400).send('Invalid Data');
    }
    if(cardIds.length > 0) {
      //if cardIds, validate, make sure the 
      let valid = true;
      const card = cardIds.forEach(c => c.id === cid);
      if(!card) {
        logger.error(`Card id with ${c.id} was not found in array`);
        valid = false;
      }
      if(!valid) {
        return res.status(400).send('Invalid Data');
      }
  }
  //if so, grab an id
  const id = uuid();
  const list = {
    id,
    header,
    cardIds
  }
  //add to list, set location
  lists.push(list);
  logger.info(`List with id ${id} was created`);
  res.status(201).location(`https://localhost:/8001/list/${id}`).json({id});
  })

listRouter
  .route('/list/:id')
  .get((req, res) => res.json(lists))
  .delete((req, res) => {
    const { id } = req.params;
    const listIndex = lists.findIndex(li => li.id === id)

    if(listIndex === -1) {
      logger.error(`List with id ${id} not found.`);
      return res.status(400).send('Not found.')
    }
    lists.splice(listIndex, 1);
    res.status(204).end();
    })

module.exports = listRouter;