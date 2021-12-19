const getObject = require('../aws/getObject')

async function authorizeUser ({ event, user, userApiKey }) {
  if (user && userApiKey) {
    const apiKeys = await getApiKeys()
    const matchingEntry = apiKeys.filter(entry => entry.user === user)[0]
    if (matchingEntry && matchingEntry.apiKey === userApiKey) {
      console.log(`[Authorise User] Authorised matching user API Key for "${user}"`)
      event.authorized = {
        actions: {
          [event.path]: event.httpMethod
        }
      }
    }
  }
}

async function getApiKeys () {
  let apiKeys = []
  try {
    const apiKeysObject = await getObject({
      Bucket: 'boardgames-tracking',
      Key: 'apiKeys.json'
    })
    apiKeys = JSON.parse(apiKeysObject)
    console.log('API Keys:', apiKeys.length, 'keys found')
  } catch (ex) {
    console.error('Unable to authorize request:', ex.message)
  }

  return apiKeys
}

async function authorize (event, context) {
  const headers = event.headers || {}
  const user = headers['calisaurus-user']
  const userApiKey = headers['calisaurus-user-api-key']

  if (user && userApiKey) {
    return authorizeUser({ event, user, userApiKey })
  }
}

module.exports = authorize
