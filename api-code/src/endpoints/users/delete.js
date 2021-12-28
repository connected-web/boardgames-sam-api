const { successResponse } = require('../../helpers/responses')

async function handler (event, context) {
  return successResponse({
    stub: 'value'
  })
}

handler.routeName = 'Delete User'
handler.routePath = '/users/delete/{resourceId}'
handler.routeMethod = 'POST'
handler.routePolicies = 'AmazonDynamoDBFullAccess'

module.exports = handler
