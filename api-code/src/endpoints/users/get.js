const getItem = require('../../generic/ddbTable/getItem')

async function handler (event, context) {
  return getItem('boardgames-api', event, context)
}

handler.routeName = 'Get User'
handler.routePath = '/users/get/{resourceId}'
handler.routeMethod = 'GET'
handler.routePolicies = 'AmazonDynamoDBReadOnlyAccess'

module.exports = handler
