var Auth0 = require('auth0')

const { isNil, pathSatisfies, curry } = require('ramda')
const on = require('./lib/handle-events')

const uidPath = ['object', 'userId']
const dataPath = ['object', 'userData']


// pure functions
const notValidId = pathSatisfies(isNil, uidPath)
const notValidData = pathSatisfies(isNil, dataPath)

module.exports = curry((config, ee) => {
  const { getUser, updateUser } = new Auth0(config)

  on(ee, '/auth0/user/get', getUser, [uidPath], notValidId)

  on(ee, '/auth0/user/update', updateUser, [uidPath, dataPath], notValidData)

})
