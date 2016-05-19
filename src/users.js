const fetch = require('node-fetch')
const { curry } = require('ramda')
const urlFormat = require('url').format

const getUser = curry((token, domain, user) =>
  fetch(urlFormat({
    protocol: 'https:',
    host: domain,
    pathname: '/api/v2/users/' + user
  }), {
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(res => res.json())
)

const updateUser = curry((token, domain, user, data) =>
  fetch(urlFormat({
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
  }).then(res => res.json())
)

module.exports = { getUser, updateUser }
