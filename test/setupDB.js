const bookshelf = require('./config/bookshelf')

function init () {
  return bookshelf.knex.schema
    .dropTableIfExists('users')
    .createTable('users', table => {
      table.increments('id')
      table.string('email').unique()
      table.string('firstName')
      table.string('lastName')
      table.unique(['firstName', 'lastName'])
    })
}

function clear () {
  return bookshelf.knex('users').del()
}

module.exports = {
  init,
  clear
}
