const { successResponse } = require('../../helpers/responses')

async function handler (event, context) {
  return successResponse({
    stub: 'value'
  })
}

handler.routeName = 'Patch User'
handler.routePath = '/users/patch/{resourceId}'
handler.routeMethod = 'PUT'
handler.routePolicies = 'AmazonDynamoDBFullAccess'

module.exports = handler
