var test = require('tap').test
var newEvent = require('palmettoflow-event').newEvent

var rewire = require('rewire')

var palmetto = require('palmettoflow-nodejs')
var ee = palmetto()

var svcConfig = rewire('../')

svcConfig.__set__('Auth0', function (cfg) {
  return {
    updateUserPassword: function (user_id, password, verify, cb) {
      cb(null, 'You can now login to the application with the new password.')
    }
  }
})

var svc = svcConfig({
  domain: 'example.auth0.com',
  clientID: '[client id]',
  clientSecret: '[client secret]'
})

svc(ee)

test('change password', function (t) {
  var ne = newEvent('auth0/users/password', 'update', {
    user_id: '[user id]',
    email: '[new password]',
    verify: false
  })

  ee.on(ne.from, function (event) {
    t.equals(event.object.message, 'You can now login to the application with the new password.')
    t.end()
  })
  ee.emit('send', ne)
})
