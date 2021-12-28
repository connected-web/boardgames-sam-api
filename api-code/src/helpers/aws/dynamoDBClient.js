const AWS = require('aws-sdk')
const doc = require('dynamodb-doc')

AWS.config.update({
  region: 'eu-west-2'
})

const dynamo = new doc.DynamoDB()

module.exports = { dynamo }
