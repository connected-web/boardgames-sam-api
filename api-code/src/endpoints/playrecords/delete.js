const interfaces = require('../../helpers/interfaces')
const HTTP_CODES = require('../../helpers/httpCodes')
const { successResponse, errorResponse } = require('../../helpers/responses')

async function handler (event, context) {
  const { authorizer, console, deleteObject } = interfaces.get()
  await authorizer(event, context)
  if (event?.authorized?.actions[event.path] !== 'DELETE') {
    return errorResponse(HTTP_CODES.clientUnauthorized, 'User not authorized to access this endpoint.')
  }

  let payload
  try {
    if (event.body) {
      payload = JSON.parse(event.body)
    } else {
      throw new Error('No body provided in event')
    }
  } catch (ex) {
    console.error('[Delete Play Record] Unable to parse payload', ex.message)
    return errorResponse(HTTP_CODES.clientError, `Unable to parse payload - expected JSON: ${ex.message}`)
  }

  const { keypath } = payload
  if (!keypath) {
    const errorMessage = `Unable to delete play record: Empty keypath provided in payload (${keypath})`
    console.log('[Delete Play Record] Client error', errorMessage)
    return errorResponse(HTTP_CODES.clientError, errorMessage)
  }

  try {
    const bucket = 'boardgames-tracking'
    await deleteObject({
      Bucket: bucket,
      Key: keypath
    })
    console.log(`[Delete Play Record] Successfully removed ${keypath} from ${bucket}`)
  } catch (err) {
    console.log('[Delete Play Record] Error', err.message)
    return errorResponse(HTTP_CODES.serverError, `Unable to delete play record: ${err.message}`)
  }

  return successResponse({
    message: 'Play record deleted successfully',
    keypath
  })
}

handler.routeName = 'Delete Play Record'
handler.routePath = '/playrecords/delete'
handler.routeMethod = 'DELETE'

module.exports = handler
