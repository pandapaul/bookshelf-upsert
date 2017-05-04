const { describe, it, before } = require('mocha')
const should = require('should')
const userModel = require('./model/user')
const setupDB = require('./setupDB')

before(setupDB.init)

describe('upsert', () => {
  const aUser = {
    email: 'one@test.com',
    firstName: 'User',
    lastName: 'One'
  }
  it('performs an insert when a table is freshly wiped', () => {
    let created, updated
    return userModel.forge(aUser)
    .on('created', () => {
      created = true
    })
    .on('updated', () => {
      updated = true
    })
    .upsert()
    .then(user => {
      should(created).be.ok()
      should(updated).not.be.ok()
      aUser.id = user.get('id')
    })
  })
  it('performs an insert when keys are different', () => {
    let created, updated
    const anotherUser = {
      email: 'two@test.com',
      firstName: 'User',
      lastName: 'Two'
    }
    return userModel.forge(anotherUser)
    .on('created', () => {
      created = true
    })
    .on('updated', () => {
      updated = true
    })
    .upsert()
    .then(user => {
      should(created).be.ok()
      should(updated).not.be.ok()
    })
  })
})
