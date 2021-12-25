const genericDDBTable = require('../../generic/ddbTable')
const handler = genericDDBTable('boardgames-api').createItem

handler.routeName = 'Create User'
handler.routePath = '/users/create/{resourceId}'
handler.routeMethod = 'PUT'
handler.routePolicies = 'AmazonDynamoDBFullAccess'

module.exports = handler
