const createItem = require('../../generic/ddbTable/createItem')

async function handler (event, context) {
  return createItem('boardgames-api', event, context)
}

handler.routeName = 'Create User'
handler.routePath = '/users/create/{resourceId}'
handler.routeMethod = 'PUT'
handler.routePolicies = 'AmazonDynamoDBFullAccess'

module.exports = handler
