const Bookshelf = require('bookshelf')
const Knex = require('knex')
const upsert = require('../..')

const knex = Knex({
  client: 'sqlite3',
  connection: {
    filename: './testdb.sqlite'
  },
  useNullAsDefault: true
})
const bookshelf = Bookshelf(knex)
bookshelf.plugin(upsert)

module.exports = bookshelf
