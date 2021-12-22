const interfaces = require('../../helpers/interfaces')
const HTTP_CODES = require('../../helpers/httpCodes')
const { successResponse, errorResponse } = require('../../helpers/responses')

async function handler (event, context) {
  const { authorizer, console, putObject, now } = interfaces.get()
  await authorizer(event, context)
  if (event?.authorized?.actions[event.path] !== 'POST') {
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
    console.error('[Create Play Record] Unable to parse payload', ex.message)
    return errorResponse(HTTP_CODES.clientError, `Unable to parse payload - expected JSON: ${ex.message}`)
  }

  // Generate S3 key e.g. 2021-12-01T23:11:25.556Z.json
  const currentDate = now()
  const year = `${currentDate.toISOString().substring(0, 4)}`
  const month = `${currentDate.toISOString().substring(5, 7)}`
  const filename = `${currentDate.toISOString()}.json`
  const keypath = [year, month, filename].join('/')
  const payloadBody = JSON.stringify(payload)

  try {
    const bucket = 'boardgames-tracking'
    await putObject({
      Bucket: bucket,
      Key: keypath,
      Body: payloadBody,
      ContentType: 'application/json; charset=utf-8'
    })
    console.log(`[Create Play Record] Successfully stored ${payloadBody.length} bytes in ${bucket}, ${keypath}`)
  } catch (err) {
    console.log('[Create Play Record] Error', err.message)
    return errorResponse(HTTP_CODES.serverError, `Unable to store payload: ${err.message}`)
  }

  return successResponse({
    message: 'Stored play data successfully',
    year,
    month,
    filename,
    keypath,
    payload
  })
}

handler.routeName = 'Create Play Record'
handler.routePath = '/playrecords/create'
handler.routeMethod = 'POST'
handler.routePolicies = [{
  S3FullAccessPolicy: {
    BucketName: 'boardgames-tracking'
  }
}]

module.exports = handler
