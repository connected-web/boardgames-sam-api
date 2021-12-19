const interfaces = require('../helpers/interfaces')
const HTTP_CODES = require('../helpers/httpCodes')
const { successResponse, errorResponse } = require('../helpers/responses')

async function handler (event, context) {
  const { authorizer, console, listObjects } = interfaces.get()
  await authorizer(event, context)
  if (event?.authorized?.actions[event.path] !== 'GET') {
    return errorResponse(HTTP_CODES.clientUnauthorized, 'User not authorized to access this endpoint.')
  }

  const result = {}

  try {
    const playRecords = await listObjects({
      Bucket: 'boardgames-tracking',
      Prefix: ''
    })
    result.playRecords = playRecords?.Contents || []

    console.log(`[List Play Records Handler] Received ${JSON.stringify(playRecords).length} bytes from S3.`)
  } catch (err) {
    console.log('[List Play Records Handler] Error', err.message)
    return errorResponse(HTTP_CODES.serverError, `Unable to list play records: ${err.message} ${err.stack}`)
  }

  return successResponse(result)
}

handler.routeName = 'List Play Records'
handler.routePath = '/playrecords/list'
handler.routeMethod = 'GET'

module.exports = handler
