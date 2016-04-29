const { response, responseError }  = require('palmettoflow-event')
const { curry } = require('ramda')

const sendResponse = curry((ee, event, res) =>
  ee.emit('send', response(event, res)))

const sendError = curry((ee, event, err) =>
  ee.emit('send', responseError(event, err)))

const notFound = curry((ee, event) => sendError(ee, event, {
  message: 'userId and/or userData is required in event object'
}))

module.exports = { sendResponse, sendError, notFound }
