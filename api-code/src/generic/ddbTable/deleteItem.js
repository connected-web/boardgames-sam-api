const HTTP_CODES = require('../../helpers/httpCodes')
const { successResponse, errorResponse } = require('../../helpers/responses')
const interfaces = require('../../helpers/interfaces')

async function deleteItem (tableName, event, context) {
  const { dynamo } = interfaces.get()
  let success
  const result = new Promise((resolve, reject) => {
    success = resolve
  })

  const { resourceId } = event.pathParameters
  if (!resourceId) {
    return errorResponse(HTTP_CODES.clientError, `No resource ID provided: (${resourceId})`)
  }

  const params = {
    TableName: tableName,
    Key: {
      id: resourceId
    }
  }

  dynamo.deleteItem(params, (err, data) => {
    let response
    if (err) {
      response = errorResponse(HTTP_CODES.serverError, err.message)
    } else {
      response = successResponse(data?.Item?.doc)
    }
    success(response)
  })

  return result
}

module.exports = deleteItem
