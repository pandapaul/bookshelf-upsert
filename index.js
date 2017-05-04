
module.exports = bookshelf => {
  bookshelf.Model = bookshelf.Model.extend({
    upsert (attributes) {
      return this.save(attributes, { method: 'update' })
      .catch(err => {
        if (err instanceof bookshelf.Model.NoRowsUpdatedError) {
          return this.save(attributes, { method: 'insert' })
        }
        throw err
      })
    }
  })
}
