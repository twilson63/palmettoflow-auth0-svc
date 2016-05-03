const test = require('tap').test
const rewire = require('rewire')
const { curry } = require('ramda')
const { newEvent } = require('palmettoflow-event')
var ee = require('palmettoflow-nodejs')()
var svcConfig = rewire('../../')

test('getUser-successPath', t => {
  t.test('Should return user data from auth0/user/get call', tt => {
    var response = { email: 'foo@bar.net' }

    var revert = svcConfig.__set__('getUser', curry((data, data2, data3) => new Promise((resolve, reject) => resolve(response))))

    var ne = newEvent('auth0/user', 'get', {userId: 'auth0|12345'})

    var svc = svcConfig({
      domain: 'example.auth0.com',
      token: 'TOKEN'
    })

    svc(ee)

    ee.on(ne.from, event => {
      t.deepEqual(response, event.object, 'should respond without error from palmetto call')
      revert()
      tt.end()
      t.end()
    })

    setTimeout(function() {
      ee.emit('send', ne)
    }, 500)
  })

})