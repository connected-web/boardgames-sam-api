const createItem = require('./ddbTable/createItem')
const deleteItem = require('./ddbTable/deleteItem')
const getItem = require('./ddbTable/getItem')
const patchItem = require('./ddbTable/patchItem')

module.exports = (tableName) => {
  return {
    tableName,
    createItem: (event, context) => createItem(tableName, event, context),
    deleteItem: (event, context) => deleteItem(tableName, event, context),
    getItem: (event, context) => getItem(tableName, event, context),
    patchItem: (event, context) => patchItem(tableName, event, context)
  }
}
