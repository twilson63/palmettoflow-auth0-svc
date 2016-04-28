const test = require('ava')
const rewire = require('rewire')
const { newEvent } = require('palmettoflow-event')
var ee = require('palmettoflow-nodejs')()
var svcConfig = rewire('../../')

test('Should return error from auth0/user/update', t => {

  var revert1 = svcConfig.__set__('Auth0', config => {
    return {
      updateUser: input => new Promise((resolve, reject) => {reject({ error: 'Unable to updateUser at this time' })})
    }
  })

  var ne = newEvent('auth0/user', 'update', {userId: '123456'})

  var svc = svcConfig({
    domain: 'example.auth0.com',
    clientID: '[client id]',
    clientSecret: '[client secret]'
  })

  svc(ee)

  ee.on(ne.from, event => {
    t.is(event.subject, 'auth0/user/update-error', 'should return subject with "-error" suffix')
    t.is(event.object.error, 'Unable to updateUser at this tim', 'should return error message from call')
  })

  ee.emit('send', ne)
  revert1()
})
