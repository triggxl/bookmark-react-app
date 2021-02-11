// BookmarksService object in the bookmarks-server project that will support CRUD for bookmarks using Knex.
const BookmarksService = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmarks')
  },
  insertBookmark(knex, newBookmark) {
    return knex
      .insert(newBookmark)
      .into('bookmarks')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('bookmarks').select('*').where('id', id).first()
  },
  deleteBookmarks(knex, id) {
    return knex('bookmarks')
      .where({ id })
      .delete()
  },
  updateBookmarks(knex, id, newBookmarkFields) {
    return knex('bookmarks')
      .where({ id })
      .update(newBookmarkFields)
  },
}

module.exports = BookmarksService