const deleteItem = require('../../generic/ddbTable/deleteItem')

async function handler (event, context) {
  return deleteItem('boardgames-api', event, context)
}

handler.routeName = 'Delete User'
handler.routePath = '/users/delete/{resourceId}'
handler.routeMethod = 'DELETE'
handler.routePolicies = 'AmazonDynamoDBFullAccess'

module.exports = handler
