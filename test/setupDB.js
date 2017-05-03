const bookshelf = require('./config/bookshelf')

function init () {
  return bookshelf.knex.schema
    .dropTableIfExists('users')
    .createTable('users', table => {
      table.string('email').primary()
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
