const test = require('ava')
const rewire = require('rewire')
const { newEvent } = require('palmettoflow-event')
var ee = require('palmettoflow-nodejs')()
var svcConfig = rewire('../../')

test('Should return user data from auth0/user/update call', t => {

  var updateData = { email: 'foo.bar@baz.net' }

  var revert = svcConfig.__set__('Auth0', config => {
    return {
      updateUser: (input1, input2) => new Promise((resolve, reject) => {resolve(updateData)})
    }
  })

  var svc = svcConfig({
    domain: 'example.auth0.com',
    clientID: '[client id]',
    clientSecret: '[client secret]'
  })

  svc(ee)

  var ne = newEvent('auth0/user', 'update', {userId: '123456', userData: {email: 'foo@bar.com'}})

  ee.on(ne.from, event => {
    t.deepEqual(updateData, event.object, 'should respond without error from palmetto call')
  })

  ee.emit('send', ne)
  revert()
})
