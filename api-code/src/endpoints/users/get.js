const { successResponse } = require('../../helpers/responses')

async function handler (event, context) {
  return successResponse({
    stub: 'value'
  })
}

handler.routeName = 'Get User'
handler.routePath = '/users/get/{resourceId}'
handler.routeMethod = 'GET'
handler.routePolicies = 'AmazonDynamoDBReadOnlyAccess'

module.exports = handler
