const { sendResponse, sendError, notFound }  = require('./handle-responses')

const { curry, path, __ } = require('ramda')

// process promised based function
const processReq = curry((ee, fn, args, e) => {
  fn.apply(null, args.map(path(__, e)), e)
    .then(sendResponse(ee, e))
    .catch(sendError(ee, e))
})

// handle palmetto flow on event with a valid response
const on = curry((ee, name, action, args, test) => {
  ee.on(name, event => {
    if (test(event)) { return notFound(ee, event) }
    processReq(ee, action, event)
  })
})

module.exports = on
