const bookmarksService = {
  getAllArticles(knex) {
    return knex.select('*').from('bookmarks_assgn')
  },
  insertBookmark(knex, newBookmark) {
    return knex
      .insert(newBookmark)
      .into('bookmarks_assgn')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('bookmarks_assgn').select('*').where('id', id).first()
  },
  deleteArticle(knex, id) {
    return knex('bookmarks_assgn')
      .where({ id })
      .delete()
  },
  updateArticle(knex, id, newBookmarkFields) {
    return knex('bookmarks_assgn')
      .where({ id })
      .update(newBookmarkFields)
  },
}

module.exports = bookmarksService