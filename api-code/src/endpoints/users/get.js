const HTTP_CODES = require('../../helpers/httpCodes')
const { successResponse, errorResponse } = require('../../helpers/responses')

async function handler (event, context) {
  let genericDDBTable, getItem
  try {
    genericDDBTable = require('../../generic/ddbTable')
  } catch (ex) {
    errorResponse(HTTP_CODES.serverError, 'Error loading generic/ddbTable;', ex.message)
  }

  try {
    getItem = genericDDBTable('boardgames-api').getItem
  } catch (ex) {
    errorResponse(HTTP_CODES.serverError, 'Error generating genericDDBTable.getItem handler for boardgames-api;', ex.message)
  }

  try {
    const response = getItem(event, context)
    successResponse({ response })
  } catch (ex) {
    errorResponse(HTTP_CODES.serverError, 'Error calling genericDDBTable.getItem handler;', ex.message)
  }
}

handler.routeName = 'Get User'
handler.routePath = '/users/get/{resourceId}'
handler.routeMethod = 'GET'
handler.routePolicies = 'AmazonDynamoDBReadOnlyAccess'

module.exports = handler
