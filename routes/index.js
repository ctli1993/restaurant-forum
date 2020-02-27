let routes = require('./routes')
let api = require('./apis')

module.exports = (app) => {
  app.use('/', routes)
  app.use('/api', api)
}