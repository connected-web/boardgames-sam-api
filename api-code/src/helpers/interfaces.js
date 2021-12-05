const { PutObjectCommand } = require('@aws-sdk/client-s3')
const { s3Client } = require('./s3Client.js')

function createPutObject (params) {
  return new PutObjectCommand(params)
}

const interfaces = {
  console,
  createPutObject,
  s3Client,
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
