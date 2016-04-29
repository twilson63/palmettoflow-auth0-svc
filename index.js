var Auth0 = require('auth0')
const { response, responseError }  = require('palmettoflow-event')
const { has, curry, compose, not, isNil, pathSatisfies } = require('ramda')

// pure functions
const userIdNotFound = { message: 'userId is required in event object'}
const userDataNotFound = { message: 'userData is required in event object'}

const sendResponse = curry((ee, event, res) =>
  ee.emit('send', response(event, res)))

const sendError = curry((ee, event, err) =>
  ee.emit('send', responseError(event, err)))

const notValidId = pathSatisfies(isNil, ['object', 'userId'])
const notValidData = pathSatisfies(isNil, ['object', 'userData'])


module.exports = config => {
  const { getUser, updateUser } = new Auth0(config)
  return ee => {

    ee.on('/auth0/user/get', event => {
      if (notValidId(event)) {
        return sendError(ee, event, userIdNotFound)
      }

      // get auth0 user information
      getUser(event.object.userId)
        .then(sendResponse(ee, event))
        .catch(sendError(ee, event))
    })

    ee.on('/auth0/user/update', event => {
      if (notValidId(event)) {
        return sendError(ee, event, userIdNotFound)
      }
      if (notValidData(event)) {
        return sendError(ee, event, userDataNotFound)
      }
      // update auth0 user information
      updateUser(event.object.userId, event.object.userData)
        .then(sendResponse(ee, event))
        .catch(sendError(ee, event))
    })
  }
}
