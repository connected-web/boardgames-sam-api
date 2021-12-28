const asyncFs = require('fs/promises')
const path = require('path')
const asyncExec = require('./api-code/tests/unit/helpers/asyncExec')

async function run() {
  let { CURRENT_BRANCH } = process.env
  if (!CURRENT_BRANCH) {
    CURRENT_BRANCH = (await asyncExec('git rev-parse --abbrev-ref HEAD')).stdout.trim()
  }

  const currentBranchFilepath = path.join(__dirname, 'api-code/current-branch.txt')
  await asyncFs.writeFile(currentBranchFilepath, CURRENT_BRANCH, 'utf-8')

  console.log('Created', currentBranchFilepath, 'with the value:', CURRENT_BRANCH)
}

run()