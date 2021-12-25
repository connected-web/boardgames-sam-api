const genericDDBTable = require('../../generic/ddbTable')
const handler = genericDDBTable('boardgames-api').deleteItem

handler.routeName = 'Delete User'
handler.routePath = '/users/delete/{resourceId}'
handler.routeMethod = 'POST'
handler.routePolicies = [{
  AmazonDynamoDBFullAccess: {}
}]

module.exports = handler
