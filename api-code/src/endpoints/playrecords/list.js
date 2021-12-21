const interfaces = require('../../helpers/interfaces')
const HTTP_CODES = require('../../helpers/httpCodes')
const { successResponse, errorResponse } = require('../../helpers/responses')

async function getJsonObject (key) {
  const { getObject } = interfaces.get()
  let recordBody, recordData
  try {
    recordBody = await getObject({
      Bucket: 'boardgames-tracking',
      Key: key
    })
    recordData = JSON.parse(recordBody)
    recordData.key = key
  } catch (ex) {
    recordData = {
      key,
      error: ex.message,
      recordBody
    }
  }
  return recordData
}

async function handler (event, context) {
  const { authorizer, console, listObjects } = interfaces.get()
  await authorizer(event, context)
  if (event?.authorized?.actions[event.path] !== 'GET') {
    return errorResponse(HTTP_CODES.clientUnauthorized, 'User not authorized to access this endpoint.')
  }

  const result = {}

  try {
    const recordSearch = await listObjects({
      Bucket: 'boardgames-tracking',
      Prefix: ''
    })
    const recordList = recordSearch?.Contents || []
    const recordKeys = recordList
      .filter(item => item.Key.includes('.json') && !item.Key.includes('apiKeys'))
      .map(item => item.Key)
    const recordGathering = recordKeys.map(getJsonObject)
    const records = await Promise.all(recordGathering)
    result.playRecords = records

    console.log(`[List Play Records] Received ${JSON.stringify(records).length} bytes from S3.`)
  } catch (err) {
    console.log('[List Play Records] Error', err.message)
    return errorResponse(HTTP_CODES.serverError, `Unable to list play records: ${err.message} ${err.stack}`)
  }

  return successResponse(result)
}

handler.routeName = 'List Play Records'
handler.routePath = '/playrecords/list'
handler.routeMethod = 'GET'

module.exports = handler
