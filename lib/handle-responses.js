const { response, responseError }  = require('palmettoflow-event')
const { curry } = require('ramda')

// send success response
const sendResponse = curry((ee, event, res) =>
  ee.emit('send', response(event, res)))

// send error response
const sendError = curry((ee, event, err) =>
  ee.emit('send', responseError(event, err)))

// send custom error response ie not found
const notFound = curry((ee, event) => sendError(ee, event, {
  message: 'userId and/or userData is required in event object'
}))

module.exports = { sendResponse, sendError, notFound }
