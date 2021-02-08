module.exports = {
  PORT: process.env.PORT || 8001,
  NODE_ENV: process.env.DB_URL || 'postgresql://dunder_mifflin@localhost/bookmarks'
}