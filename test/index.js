const { describe, it, before } = require('mocha')
const should = require('should')
const userModel = require('./model/user')
const setupDB = require('./setupDB')

before(setupDB.init)

describe('upsert', () => {
  it('inserts a new user when no matching one exists', () => {
    return userModel.forge().upsert()
    .then(user => {
      should(user).be.ok()
      user.get('email').should.be.ok()
    })
  })
})
