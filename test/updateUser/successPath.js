const test = require('tap').test
const rewire = require('rewire')
const curry = require('ramda').curry
const newEvent = require('palmettoflow-event').newEvent 
var ee = require('palmettoflow-nodejs')()
var svcConfig = rewire('../../dist')

test('updateUser-successPath', t => {
  t.test('Should return user data from auth0/user/update call', tt => {
    var response = { email: 'foo.baz@bar.net' }

    var revert = svcConfig.__set__('updateUser', curry((data, data2, data3, data4) => new Promise((resolve, reject) => resolve(response))))

    var ne = newEvent('auth0/user', 'update', {userId: 'auth0|12345'})

    var svc = svcConfig({
      domain: 'example.auth0.com',
      token: 'TOKEN'
    })

    svc(ee)

    ee.on(ne.from, event => {
      t.deepEqual(event.object.email, 'foo.baz@bar.net', 'should respond without error from palmetto call')
      revert()
      tt.end()
      t.end()
    })

    setTimeout(function() {
      ee.emit('send', ne)
    }, 500)
  })

})
