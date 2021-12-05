const interfaces = require('../helpers/interfaces')
const { successResponse } = require('../helpers/responses')
const packageJson = require('../../package.json')

async function handler (event, context) {
  const { console, now } = interfaces.get()
  const { name, version, description } = packageJson
  console.log('Status endpoint', now(), event)
  return successResponse({
    name,
    version,
    description,
    currentDate: now().toISOString()
  })
}

handler.routeName = 'Status'
handler.routePath = '/status'
handler.routeMethod = 'GET'

module.exports = handler
