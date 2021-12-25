const genericDDBTable = require('../../generic/ddbTable')
const handler = genericDDBTable('boardgames-api').getItem

handler.routeName = 'Get User'
handler.routePath = '/users/get/{resourceId}'
handler.routeMethod = 'GET'
handler.routePolicies = [{
  AmazonDynamoDBReadOnlyAccess: {}
}]

module.exports = handler
