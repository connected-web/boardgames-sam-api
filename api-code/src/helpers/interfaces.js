const authorizer = require('./auth/authorizer')
const getObject = require('./aws/getObject')
const putObject = require('./aws/putObject')
const listObjects = require('./aws/listObjects')

const interfaces = {
  authorizer,
  console,
  getObject,
  putObject,
  listObjects,
  now: () => new Date()
}
const originalInterfaces = Object.assign({}, interfaces)

function modifyInterfaces (overrides) {
  Object.assign(interfaces, overrides)
  return originalInterfaces
}

function resetInterfaces () {
  Object.assign(interfaces, originalInterfaces)
}

function get () {
  return interfaces
}

module.exports = {
  modifyInterfaces,
  resetInterfaces,
  get
}
