const { PutObjectCommand } = require('@aws-sdk/client-s3')
const packageJson = require('./package.json')
const { s3Client } = require('./src/helpers/s3Client.js')
const HTTP_CODES = require('./src/helpers/httpCodes')
const { successResponse, errorResponse } = require('./src/helpers/responses')

function createPutObject (params) {
  return new PutObjectCommand(params)
}

const interfaces = {
  console,
  createPutObject,
  s3Client,
  now: () => new Date()
}
const originalInterfaces = Object.assign({}, interfaces)

exports.modifyInterfaces = function (overrides) {
  Object.assign(interfaces, overrides)
  return originalInterfaces
}

exports.resetInterfaces = function () {
  Object.assign(interfaces, originalInterfaces)
}

exports.statusHandler = async (event, context) => {
  const { console, now } = interfaces
  const { name, version, description } = packageJson
  console.log('Status endpoint', now(), event)
  return successResponse({
    name,
    version,
    description,
    currentDate: now().toISOString()
  })
}

exports.playDataHandler = async (event, context) => {
  const { console, createPutObject, now, s3Client } = interfaces
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
