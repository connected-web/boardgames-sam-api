const interfaces = require('../helpers/interfaces')
const { successResponse } = require('../helpers/responses')
const packageJson = require('../../package.json')

const path = require('path')
const asyncFs = require('fs/promises')

async function handler (event, context) {
  const { console, now } = interfaces.get()
  const { name, version, description } = packageJson
  console.log('Status endpoint', now(), event)

  let currentBranch = 'unknown'
  const currentBranchFilepath = path.join(__dirname, '../../current-branch.txt')
  try {
    currentBranch = (await asyncFs.readFile(currentBranchFilepath, 'utf8')).trim()
  } catch (ex) {
    console.error('Status Endpoint; unable to read', currentBranchFilepath, '- check if build command executed correctly.')
  }

  return successResponse({
    name,
    version,
    description,
    currentBranch,
    currentDate: now().toISOString()
  })
}

handler.routeName = 'Status'
handler.routePath = '/status'
handler.routeMethod = 'GET'

module.exports = handler
