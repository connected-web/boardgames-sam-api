const interfaces = require('../helpers/interfaces')
const HTTP_CODES = require('../helpers/httpCodes')
const { successResponse, errorResponse } = require('../helpers/responses')

async function handler (event, context) {
  const { console, createPutObject, now, s3Client } = interfaces.get()
  let payload
  try {
    if (event.body) {
      payload = JSON.parse(event.body)
    } else {
      throw new Error('No body provided in event')
    }
  } catch (ex) {
    console.error('[Play Data Handler] Unable to parse payload', ex.message)
    return errorResponse(HTTP_CODES.clientError, `Unable to parse payload - expected JSON: ${ex.message}`)
  }

  // Generate S3 key e.g. 2021-12-01T23:11:25.556Z.json
  const currentDate = now()
  const folder = `${currentDate.toISOString().substring(0, 7)}`
  const filename = `${currentDate.toISOString()}.json`
  const keypath = [folder, filename].join('/')
  const payloadBody = JSON.stringify(payload)

  // Set the S3 parameters
  const params = {
    Bucket: 'boardgames-tracking',
    Key: keypath,
    Body: payloadBody
  }

  try {
    const putObject = createPutObject(params)
    await s3Client.send(putObject)
    console.log(`[Play Data Handler] Successfully stored ${payloadBody.length} bytes in ${params.Bucket}, ${params.Key}`)
  } catch (err) {
    console.log('[Play Data Handler] Error', err.message)
    return errorResponse(HTTP_CODES.serverError, `Unable to store payload: ${err.message}`)
  }

  return successResponse({
    message: 'Stored play data successfully',
    folder,
    filename,
    keypath,
    payload
  })
}

module.exports = handler
