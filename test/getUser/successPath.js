const test = require('ava')
const rewire = require('rewire')
const { newEvent } = require('palmettoflow-event')
var ee = require('palmettoflow-nodejs')()
var svcConfig = rewire('../../')

test('Should return user data from auth0/user/get call', t => {

  var response = { email: 'foo@bar.net' }

  var revert = svcConfig.__set__('Auth0', config => {
    return {
      getUser: input => new Promise((resolve, reject) => {resolve(response)})
    }
  })

  var svc = svcConfig({
    domain: 'example.auth0.com',
    clientID: '[client id]',
    clientSecret: '[client secret]'
  })

  svc(ee)

  var ne = newEvent('auth0/user', 'get', {userId: '123456'})

  ee.on(ne.from, event => {
    t.deepEqual(response, event.object.message, 'should respond without error from palmetto call')
  })

  ee.emit('send', ne)
  revert()
})
