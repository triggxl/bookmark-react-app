// BookmarksService object in the bookmarks-server project that will support CRUD for bookmarks using Knex.
const BookmarksService = {
  getAllBookmarks(knex) {
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
  deleteBookmarks(knex, id) {
    return knex('bookmarks_assgn')
      .where({ id })
      .delete()
  },
  updateBookmarks(knex, id, newBookmarkFields) {
    return knex('bookmarks_assgn')
      .where({ id })
      .update(newBookmarkFields)
  },
}

module.exports = BookmarksService