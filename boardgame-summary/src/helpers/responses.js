const HTTP_CODES = require('./httpCodes')
const corsHeaders = require('./corsHeaders')

function errorResponse (statusCode, message) {
  return {
    statusCode: statusCode || HTTP_CODES.serverError,
    headers: corsHeaders,
    body: JSON.stringify({
      message
    })
  }
}

function successResponse (payload) {
  return {
    statusCode: HTTP_CODES.success,
    headers: corsHeaders,
    body: JSON.stringify(payload)
  }
}

module.exports = {
  errorResponse,
  successResponse
}
