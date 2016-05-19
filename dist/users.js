var fetch = require('node-fetch')
var ref = require('ramda');
var curry = ref.curry
var urlFormat = require('url').format

var getUser = curry(function (token, domain, user) { return fetch(urlFormat({
    protocol: 'https:',
    host: domain,
    pathname: '/api/v2/users/' + user
  }), {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(function ( res ) { return res.json(); }); }
)

var updateUser = curry(function (token, domain, user, data) { return fetch(urlFormat({
    protocol: 'https:',
    host: domain,
    pathname: '/api/v2/users/' + user
  }), {
    method: 'PATCH',
    body: JSON.stringify(data, null, 2),
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  }).then(function ( res ) { return res.json(); }); }
)

module.exports = { getUser: getUser, updateUser: updateUser }
