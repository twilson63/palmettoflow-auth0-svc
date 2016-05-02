const test = require('tap').test
const rewire = require('rewire')
const { newEvent } = require('palmettoflow-event')
var ee = require('palmettoflow-nodejs')()
var svcConfig = rewire('../../')
const { curry } = require('ramda')

test('getUser-failurePath', t => {
  t.test('Should return error from auth0/user/update', tt => {

    var revert = svcConfig.__set__('updateUser', curry((data, data2, data3, data4) => new Promise((resolve, reject) => reject({error: 'Unable to getUser at this time'}))))

    var ne = newEvent('auth0/user', 'update', {userId: 'auth0|12345', userData: {email: 'foo.bar@baz.com'}})

    var svc = svcConfig({
      domain: 'domain.auth0.com',
      token: 'TOKEN'
    })

    svc(ee)

    ee.on(ne.from, event => {
      tt.equals(event.subject, 'auth0/user-error', 'should return subject with "-error" suffix')
      tt.equals(event.object.error, 'Unable to getUser at this time', 'should return error message from call')
      revert()
      tt.end()
      t.end()
    })

    setTimeout(function() {
      ee.emit('send', ne)
    }, 500)
  })
})

