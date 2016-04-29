const { fromEvent, fromPromise } = require('most')
const { curry, path } = require('ramda')
const { response, responseError }  = require('palmettoflow-event')

const svc = curry((config, ee) => {
  const { getUser, updateUser } = new Auth0(config)
  const send = ev => ee.emit('send', ev)

  fromEvent('/auth0/user/get', ee)
    .flatMap(handleGetUser)
    .observe(send)

  fromEvent('/auth0/user/update', ee)
    .flatMap(handleUpdateUser)
    .observe(send)

  return ee

  function handleGetUser (event) {
    const userId = path(['object','userId'], event) || null

    return fromPromise(getUser(userId)
      .then(data => response(data, event))
      .catch(err => responseError(err, event))
    )
  }

  function handleUpdateUser (event) {
    const userId = path(['object','userId'], event) || null
    const userData = path(['object','userData'], event) || null

    return fromPromise(updateUser(userId, userData)
      .then(data => response(data, event))
      .catch(err => responseError(err, event))
    )
  }
})

// export svc
module.exports = svc
