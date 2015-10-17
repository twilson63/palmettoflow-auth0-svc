var response = require('palmettoflow-event').response
var responseError = require('palmettoflow-event').responseError

var Auth0 = require('auth0')

module.exports = function (config) {
  var api = new Auth0(config)
  return function (ee) {
    ee.on('/auth0/users/email/update', function (event) {
      api.updateUserEmail(
        event.object.user_id,
        event.object.email,
        event.object.verify,
        function (err, result) {
          if (err) { return ee.emit('send', responseError(event, err)) }
          ee.emit('send', response(event, {message: result}))
        }
      )
    })

    ee.on('/auth0/users/password/update', function (event) {
      api.updateUserPassword(
        event.object.user_id,
        event.object.password,
        event.object.verify,
        function (err, result) {
          if (err) { return ee.emit('send', responseError(event, err)) }
          ee.emit('send', response(event, { message: result}))
        }
      )
    })
  }
}