const getObject = require('./getObject')
const putObject = require('./putObject')

const interfaces = {
  console,
  getObject,
  putObject,
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
