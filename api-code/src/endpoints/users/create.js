const { successResponse } = require('../../helpers/responses')

async function handler (event, context) {
  return successResponse({
    stub: 'value'
  })
}

handler.routeName = 'Create User'
handler.routePath = '/users/create/{resourceId}'
handler.routeMethod = 'PUT'
handler.routePolicies = 'AmazonDynamoDBFullAccess'

module.exports = handler
