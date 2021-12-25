const genericDDBTable = require('../../generic/ddbTable')
const handler = genericDDBTable('boardgames-api').patchItem

handler.routeName = 'Patch User'
handler.routePath = '/users/patch/{resourceId}'
handler.routeMethod = 'PUT'
handler.routePolicies = 'AmazonDynamoDBFullAccess'

module.exports = handler
