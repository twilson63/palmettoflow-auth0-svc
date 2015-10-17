# Palmetto Flow Service for Auth0

[![Build Status](https://travis-ci.org/twilson63/palmettoflow-auth0-svc.svg?branch=master)](https://travis-ci.org/twilson63/palmettoflow-auth0-svc)

This service manages Auth0 Api through the Palmetto Flow.

Configuration

``` js
var svc = require('palmettoflow-auth0')({
  domain: ''.
  clientID: '',
  clientSecret: ''
})

svc(ee)
```

Api methods currently implemented:

* Update Email Example

``` js
var newEvent = require('palmettoflow-event').newEvent

var ne = newEvent('auth0/users/email', 'update', {
  client_id: '....',
  email: 'foo@foo.com',
  verify: true
})

ee.on(ne.from, function (event) {
  if (event.verb === 'update-error') {
    // handle error
  }
  // result
})

ee.emit('send', ne)
```


* Update Password Example

``` js
var newEvent = require('palmettoflow-event').newEvent

var ne = newEvent('auth0/users/password', 'update', {
  client_id: '....',
  password: 'newPassword',
  verify: true
})

ee.on(ne.from, function (event) {
  if (event.verb === 'update-error') {
    // handle error
  }
  // result
})

ee.emit('send', ne)
```

