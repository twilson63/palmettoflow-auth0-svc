# Palmetto Flow Service for Auth0

[![Build Status](https://travis-ci.org/twilson63/palmettoflow-auth0-svc.svg?branch=master)](https://travis-ci.org/twilson63/palmettoflow-auth0-svc)

This service manages Auth0 Api through the Palmetto Flow.

Configuration

``` js
var palmetto = require('@twilson63/palmetto-couchdb')

var ee = palmetto({
  endpoint: palmettoConfig.endpoint,
  app: palmettoConfig.app
})

var svc = require('palmettoflow-auth0')({
  domain: '',
  clientID: '',
  clientSecret: ''
})

svc(ee)
```

Api methods currently implemented:

* Get User

``` js
var newEvent = require('palmettoflow-event').newEvent

var ne = newEvent('auth0/user', 'get', { userId: '123456' })

ee.on(ne.from, function (event) {
  if (event.verb === 'update-error') {
    // handle error
  }
  // result
})

ee.emit('send', ne)
```


* Update User

``` js
var newEvent = require('palmettoflow-event').newEvent

// For more info on updatable user properties, visit the [Auth0 docs](https://auth0.com/docs/api/v2#!/Users/patch_users_by_id)

var reqData = {
  userId: '123456',
  userData: {
    email: 'foo.bar@baz.net'
  }
}

var ne = newEvent('auth0/user', 'update', reqData)

ee.on(ne.from, function (event) {
  if (event.verb === 'update-error') {
    // handle error
  }
  // result
})

ee.emit('send', ne)
```

