const { curry, path } = require('ramda')
var { getUser, updateUser } = require('./users')
const { fromEvent, fromPromise } = require('most')
const { response, responseError }  = require('palmettoflow-event')

const handleResponse = curry((event, res) => res.error ? responseError(event, res) : response(event, res))

const svc = curry((config, ee) => {
  const get = getUser(config.token, config.domain)
  const update = updateUser(config.token, config.domain)
  const send = ev => ee.emit('send', ev)

  fromEvent('/auth0/user/get', ee)
    .flatMap(handleGetUser)
    .observe(send)

  fromEvent('/auth0/user/update', ee)
    .flatMap(handleUpdateUser)
    .observe(send)

  return ee

  function handleGetUser(event) {
    const userId = path(['object','userId'], event) || null

    return fromPromise(get(userId)
      .then(handleResponse(event))
      .catch(err => responseError(event, err))
    )
  }

  function handleUpdateUser(event) {
    const userId = path(['object','userId'], event) || null
    const userData = path(['object','userData'], event) || null

    return fromPromise(update(userId, userData)
      .then(handleResponse(event))
      .catch(err => responseError(event, err))
    )
  }
})

// export svc
module.exports = svc
