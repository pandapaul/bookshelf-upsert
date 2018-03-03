const { describe, it, before, beforeEach, afterEach } = require('mocha')
const should = require('should')
const userModel = require('./model/user')
const setupDB = require('./setupDB')
const bookshelf = require('./config/bookshelf')

before(setupDB.init)

describe('upsert', () => {
  const aUser = {
    email: 'one@test.com',
    firstName: 'User',
    lastName: 'One'
  }

  let aUserId

  beforeEach(() => {
    return userModel.forge(aUser).save()
    .then(user => {
      aUserId = user.get('id')
    })
  })

  afterEach(setupDB.clear)

  it('performs an insert when keys are different', () => {
    let created, updated
    const anotherUser = {
      id: aUserId + 1,
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

  it('performs an update when primary key is the same', () => {
    let created, updated
    const sameUser = {
      id: aUserId,
      email: 'two@test.com',
      firstName: 'User',
      lastName: 'Two'
    }
    return userModel.forge(sameUser)
    .on('created', () => {
      created = true
    })
    .on('updated', () => {
      updated = true
    })
    .upsert()
    .then(user => {
      should(created).not.be.ok()
      should(updated).be.ok()
    })
  })

  it('performs an update when a unique key is the same', () => {
    let created, updated
    return userModel.forge({
      firstName: 'User',
      lastName: 'Two'
    }).where({ email: 'one@test.com' })
    .on('created', () => {
      created = true
    })
    .on('updated', () => {
      updated = true
    })
    .upsert()
    .then(user => {
      should(created).not.be.ok()
      should(updated).be.ok()
    })
  })

  it('performs an update when a complex unique key is the same', () => {
    let created, updated
    return userModel.forge({
      email: 'two@test.com'
    }).where({
      firstName: 'User',
      lastName: 'One'
    })
    .on('created', () => {
      created = true
    })
    .on('updated', () => {
      updated = true
    })
    .upsert()
    .then(user => {
      should(created).not.be.ok()
      should(updated).be.ok()
    })
  })

  it('accepts attributes as a parameter and saves it when inserting', () => {
    let created, updated
    const anotherUser = {
      id: aUserId + 1
    }
    const attributes = {
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
    .upsert(attributes)
    .then(user => {
      should(created).be.ok()
      should(updated).not.be.ok()
      user.get('email').should.equal(attributes.email)
      user.get('firstName').should.equal(attributes.firstName)
      user.get('lastName').should.equal(attributes.lastName)
    })
  })

  it('accepts attributes as a parameter and saves it when updating', () => {
    let created, updated
    const anotherUser = {
      id: aUserId
    }
    const attributes = {
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
    .upsert(attributes)
    .then(user => {
      should(created).not.be.ok()
      should(updated).be.ok()
      user.get('email').should.equal(attributes.email)
      user.get('firstName').should.equal(attributes.firstName)
      user.get('lastName').should.equal(attributes.lastName)
    })
  })

  it('accepts attributes as a parameter and saves it when inserting', () => {
    let created, updated
    const anotherUser = {
      id: aUserId + 1
    }
    const attributes = {
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
      .upsert(attributes)
      .then(user => {
        should(created).be.ok()
        should(updated).not.be.ok()
        user.get('email').should.equal(attributes.email)
        user.get('firstName').should.equal(attributes.firstName)
        user.get('lastName').should.equal(attributes.lastName)
      })
  })

  it('accepts options as a parameter and applies them when updating', () => {
    const anotherUser = {
      id: aUserId
    }
    const attributes = {
      email: 'two@test.com',
      firstName: 'User',
      lastName: 'Two'
    }
    const options = {
      default: true,
      patch: false,
      transacting: {foo: 'bar'}
    }

    let user = userModel.forge(anotherUser)

    let saveCalled
    user.save = (attrs, opts) => {
      should(opts).have.property('transacting', options.transacting)
      should(opts).have.property('patch', options.patch)
      should(opts).have.property('default', options.default)

      saveCalled = true

      return Promise.resolve()
    }

    return user.upsert(attributes, options)
      .then(() => {
        should(saveCalled).be.ok()
      })
  })

  it('accepts options as a parameter and applies them when inserting', () => {
    const anotherUser = {
      id: aUserId
    }
    const attributes = {
      email: 'two@test.com',
      firstName: 'User',
      lastName: 'Two'
    }
    const options = {
      default: true,
      patch: false,
      transacting: {
        foo: 'bar'
      }
    }

    let user = userModel.forge(anotherUser)

    let callCount = 0
    user.save = (attrs, opts) => {
      let method = callCount === 0 ? 'update' : 'insert'
      should(opts).have.property('transacting', options.transacting)
      should(opts).have.property('patch', options.patch)
      should(opts).have.property('default', options.default)

      callCount += 1

      return method === 'update'
        ? Promise.reject(new bookshelf.Model.NoRowsUpdatedError())
        : Promise.resolve()
    }

    return user.upsert(attributes, options)
      .then(() => {
        callCount.should.equal(2)
      })
  })
})
