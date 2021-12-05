const fs = require('fs')
const path = require('path')

const endpoints = fs.readdirSync(__dirname)
  .filter(filepath => !filepath.includes('_index.js'))
  .sort((a, b) => a.localeCompare(b))
  .reduce((acc, filepath) => {
    const filename = path.basename(filepath).replace('.js', '')
    acc[filename] = require(`./${filepath}`)
    return acc
  }, {})

module.exports = endpoints
