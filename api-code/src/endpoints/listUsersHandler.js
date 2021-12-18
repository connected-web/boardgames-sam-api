const interfaces = require('../helpers/interfaces')
const HTTP_CODES = require('../helpers/httpCodes')
const { successResponse, errorResponse } = require('../helpers/responses')

async function handler (event, context) {
  const { authorizer, console, getObject } = interfaces.get()
  await authorizer(event, context)
  if (event?.authorized?.actions[event.path] !== 'GET') {
    return errorResponse(HTTP_CODES.clientUnauthorized, 'User not authorized to access this endpoint.')
  }

  const users = []

  try {
    const apiKeysObject = await getObject({
      Bucket: 'boardgames-tracking',
      Key: 'apiKeys.json'
    })

    const apiUsers = JSON.parse(apiKeysObject).map(entry => {
      return entry.user
    })

    users.push(...apiUsers)
    console.log(`[List Users Handler] Read ${apiKeysObject.length} bytes from S3 config.`)
  } catch (err) {
    console.log('[List Users Handler] Error', err.message)
    return errorResponse(HTTP_CODES.serverError, `Unable to list users: ${err.message}`)
  }

  return successResponse({
    users
  })
}

handler.routeName = 'List Users'
handler.routePath = '/users/list'
handler.routeMethod = 'GET'

module.exports = handler
