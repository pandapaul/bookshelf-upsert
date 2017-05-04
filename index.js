
module.exports = bookshelf => {
  bookshelf.Model = bookshelf.Model.extend({
    upsert (data) {
      return this.save(data, { method: 'update' })
      .catch(err => {
        if (err instanceof bookshelf.Model.NoRowsUpdatedError) {
          return this.save(data, { method: 'insert' })
        }
        throw err
      })
    }
  })
}
