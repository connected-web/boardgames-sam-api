const HTTP_CODES = require('../../helpers/httpCodes')
const { successResponse, errorResponse } = require('../../helpers/responses')
const { dynamo } = require('../../helpers/aws/dynamoDBClient')

async function getItem (tableName, event, context) {
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

  dynamo.getItem(params, (err, data) => {
    let response
    if (err) {
      response = errorResponse(HTTP_CODES.serverError, err.message)
    } else {
      const doc = data?.Item?.doc || { data: 'no data' }
      response = successResponse({
        resourceId,
        doc
      })
    }
    success(response)
  })

  return result
}

module.exports = getItem
