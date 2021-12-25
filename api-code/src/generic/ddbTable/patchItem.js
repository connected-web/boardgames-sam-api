const doc = require('dynamodb-doc')
const dynamo = new doc.DynamoDB()
const HTTP_CODES = require('../../helpers/httpCodes')
const { successResponse, errorResponse } = require('../../helpers/responses')

async function patchItem (tableName, event, context) {
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
    id: resourceId
  }

  const getItemParams = {
    TableName: tableName,
    Item: item
  }

  dynamo.getItem(getItemParams, (err, data) => {
    let response
    if (err) {
      response = errorResponse(HTTP_CODES.serverError, err.message)
    } else {
      const originalDoc = JSON.parse(data?.Item?.doc || '{}')
      const newDoc = JSON.parse(body)
      const patchedDoc = Object.assign({}, originalDoc, newDoc)

      const putItemParams = {
        TableName: tableName,
        Item: {
          id: resourceId,
          doc: JSON.stringify(patchedDoc)
        }
      }

      dynamo.putItem(putItemParams, (err, data) => {
        let response
        if (err) {
          response = errorResponse(HTTP_CODES.serverError, err.message)
        } else {
          response = successResponse(data?.Item?.doc)
        }
        success(response)
      })

      response = successResponse(data?.Item?.doc)
    }
    success(response)
  })

  return result
}

module.exports = patchItem
