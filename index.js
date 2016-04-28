var Auth0 = require('auth0')
const { response }  = require('palmettoflow-event')
const { responseError } = require('palmettoflow-event')

module.exports = config => {
  var api = new Auth0(config)
  return ee => {

    ee.on('/auth0/user/get', event => {
      api.getUser(event.object.userId)
        .then(res => ee.emit('send', response(event, {message: res})))
        .catch(err => ee.emit('send', responseError(event, err)))
    })

    ee.on('/auth0/user/update', event => {
      api.updateUser(event.object.userId, event.object.userData)
        .then(res => ee.emit('send', response(event, {message: res})))
        .catch(err => ee.emit('send', responseError(event, err)))
    })
  }
}
