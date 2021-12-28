const HTTP_CODES = require('../../helpers/httpCodes')
const { successResponse, errorResponse } = require('../../helpers/responses')
const interfaces = require('../../helpers/interfaces')

async function createItem (tableName, event, context) {
  const { dynamo } = interfaces.get()
  let success
  const result = new Promise((resolve, reject) => {
    success = resolve
  })

  const { resourceId } = event.pathParameters
  if (!resourceId) {
    return errorResponse(HTTP_CODES.clientError, `No resource ID provided: (${resourceId})`)
  }

  const { body } = event
  if (!resourceId) {
    return errorResponse(HTTP_CODES.clientError, `No document body provided: (${body})`)
  }

  const item = {
    id: resourceId,
    doc: body
  }

  const params = {
    TableName: tableName,
    Item: item
  }

  dynamo.putItem(params, (err, data) => {
    let response
    if (err) {
      response = errorResponse(HTTP_CODES.serverError, err.message)
    } else {
      response = successResponse(item)
    }
    success(response)
  })

  return result
}

module.exports = createItem
