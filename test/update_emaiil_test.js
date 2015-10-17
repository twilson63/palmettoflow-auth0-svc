var test = require('tap').test
var newEvent = require('palmettoflow-event').newEvent

var rewire = require('rewire')

var palmetto = require('palmettoflow-nodejs')
var ee = palmetto()

var svcConfig = rewire('../')

svcConfig.__set__('Auth0', function (cfg) {
  return {
    updateUserEmail: function (user_id, email, verify, cb) {
      cb(null, 'You can now login to the application with the new email.')
    }
  }
})

var svc = svcConfig({
  domain: 'example.auth0.com',
  clientID: '[client id]',
  clientSecret: '[client secret]'
})

svc(ee)

test('change email', function (t) {
  var ne = newEvent('auth0/users/email', 'update', {
    user_id: '[user id]',
    email: '[new Email]',
    verify: false
  })

  ee.on(ne.from, function (event) {
    t.equals(event.object.message, 'You can now login to the application with the new email.')
    t.end()
  })
  ee.emit('send', ne)
})
