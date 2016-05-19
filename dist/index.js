var ref = require('ramda');
var curry = ref.curry;
var path = ref.path
var ref$1 = require('./users');
var getUser = ref$1.getUser;
var updateUser = ref$1.updateUser
var ref$2 = require('most');
var fromEvent = ref$2.fromEvent;
var fromPromise = ref$2.fromPromise
var ref$3  = require('palmettoflow-event');
var response = ref$3.response;
var responseError = ref$3.responseError

var handleResponse = curry(function (event, res) { return res.error ? responseError(event, res) : response(event, res); })

var svc = curry(function (config, ee) {
  var get = getUser(config.token, config.domain)
  var update = updateUser(config.token, config.domain)
  var send = function ( ev ) { return ee.emit('send', ev); }

  fromEvent('/auth0/user/get', ee)
    .flatMap(handleGetUser)
    .observe(send)

  fromEvent('/auth0/user/update', ee)
    .flatMap(handleUpdateUser)
    .observe(send)

  return ee

  function handleGetUser(event) {
    var userId = path(['object','userId'], event) || null

    return fromPromise(get(userId)
      .then(handleResponse(event))
      .catch(function ( err ) { return responseError(event, err); })
    )
  }

  function handleUpdateUser(event) {
    var userId = path(['object','userId'], event) || null
    var userData = path(['object','userData'], event) || null

    return fromPromise(update(userId, userData)
      .then(handleResponse(event))
      .catch(function ( err ) { return responseError(event, err); })
    )
  }
})

// export svc
module.exports = svc
