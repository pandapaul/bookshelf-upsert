# bookshelf-upsert

> A [Bookshelf](http://www.bookshelfjs.org/) plugin that adds `model.upsert()`

[![Build Status](https://travis-ci.org/pandapaul/bookshelf-upsert.svg?branch=master)](https://travis-ci.org/pandapaul/bookshelf-upsert)

## Install

```
$ npm install --save bookshelf-upsert
```


## Plugging In

```js
const upsert = require('bookshelf-upsert')

bookshelf.plugin(upsert)
```


## Usage

```js
const model = require('a-bookshelf-model')

model.forge({ some: 'data' })
.where({ optional: 'constraint' })
.upsert({ optional: 'attributes' })
```


## API

### model.upsert([attributes], [options])

Bookshelf model instances are provided the `upsert` method, which may be given attributes and options that will be passed along to `model.save()`.  This implementation of upsert first attempts an update then if no rows are updated it follows up with an insert.  


## License

MIT
