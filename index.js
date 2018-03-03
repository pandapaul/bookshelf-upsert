
module.exports = bookshelf => {
  bookshelf.Model = bookshelf.Model.extend({
    upsert (attributes, options = {}) {
      return this.save(attributes, Object.assign({ method: 'update' }, options))
      .catch(err => {
        if (err instanceof bookshelf.Model.NoRowsUpdatedError) {
          return this.save(attributes, Object.assign({ method: 'insert' }, options))
        }
        throw err
      })
    }
  })
}
