'use strict'
require('dotenv').config()
const path = require('path')
const AutoLoad = require('fastify-autoload')

module.exports = function (fastify, opts, next) {
  
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'bot'),
    options: Object.assign({}, opts)
  })

  next()
}
