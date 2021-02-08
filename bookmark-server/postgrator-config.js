require('dotenv').config()

module.exports = {
  "miagrationDirectory": "migrations",
  "driver": "pg",
  "connectionString": process.env.DB_URL
}