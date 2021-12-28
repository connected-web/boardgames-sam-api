const HTTP_CODES = require('../../helpers/httpCodes')
const { successResponse, errorResponse } = require('../../helpers/responses')

async function handler (event, context) {
  let getItem
  try {
    getItem = require('../../generic/ddbTable/getItem')
  } catch (ex) {
    errorResponse(HTTP_CODES.serverError, 'Error loading generic/ddbTable;', ex.message)
  }

  return successResponse({ getItem: typeof getItem })

  /*
  try {
    const response = await getItem('boardgames-api', event, context)
    successResponse({ response })
  } catch (ex) {
    errorResponse(HTTP_CODES.serverError, 'Error calling genericDDBTable.getItem handler;', ex.message)
  }
  */
}

handler.routeName = 'Get User'
handler.routePath = '/users/get/{resourceId}'
handler.routeMethod = 'GET'
handler.routePolicies = 'AmazonDynamoDBReadOnlyAccess'

module.exports = handler
