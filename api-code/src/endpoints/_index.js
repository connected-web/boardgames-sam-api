const fs = require('fs')
const path = require('path')

const flattenTree = (obj = {}, res = {}, extraKey = '') => {
  for (const key in obj) {
    if (typeof obj[key] !== 'object') {
      res[extraKey + key] = obj[key]
    } else {
      flattenTree(obj[key], res, `${extraKey}${key}_`)
    }
  }
  return res
}

function findEndpointGroups (basePath) {
  return fs.readdirSync(basePath)
    .filter(filepath => !filepath.includes('_index.js'))
    .filter(filepath => fs.lstatSync(`${basePath}/${filepath}`).isDirectory())
    .map(filepath => {
      return {
        folder: filepath,
        fullpath: `${basePath}/${filepath}`
      }
    })
}

function findEndpointFiles ({ folder, fullpath }) {
  const endpoints = fs.readdirSync(fullpath)
    .filter(filepath => !filepath.includes('_index.js') && filepath.includes('.js'))
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, filepath) => {
      const filename = path.basename(filepath).replace('.js', '')
      acc[filename] = require(`${fullpath}/${filepath}`)
      return acc
    }, {})
  return {
    [folder]: endpoints
  }
}

function findEndpoints (basePath) {
  const defaultGroup = {
    folder: 'default',
    fullpath: basePath
  }
  const groups = [defaultGroup, ...findEndpointGroups(basePath)]
  const endpointTree = groups.map(findEndpointFiles).reduce((acc, item) => Object.assign(acc, item), {})
  const endpoints = flattenTree(endpointTree)
  return endpoints
}

module.exports = findEndpoints(__dirname)
