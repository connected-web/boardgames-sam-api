const patchItem = require('../../generic/ddbTable/patchItem')

async function handler (event, context) {
  return patchItem('boardgames-api', event, context)
}

handler.routeName = 'Patch User'
handler.routePath = '/users/patch/{resourceId}'
handler.routeMethod = 'PUT'
handler.routePolicies = 'AmazonDynamoDBFullAccess'

module.exports = handler
