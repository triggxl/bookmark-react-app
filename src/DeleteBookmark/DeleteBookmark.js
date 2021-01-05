app.delete('/list/:id', (req, res) => {
  const { id } = req.params;

  const listIndex = lists.findIndex(li => li.id == id);

  if (listIndex === -1) {
    logger.error(`List with id ${id} not found.`);
    return res
      .status(404)
      .send('Not Found');
  }
  lists.splice(listIndex, 1);

  logger.info(`List with id ${id} deleted.`);
  res
    .status(204)
    .end();
});

module.export = DeleteBookmark;

// route handler ("event listener", client) service functions (database functions)
//request from user look at data from it then tell server hey go delete this for us
// https://github.com/Thinkful-Ed/bookmarks-app/compare/context...Thinkful-Ed:implement-delete-with-context