const { S3Client } = require('@aws-sdk/client-s3')

const s3Client = new S3Client({
  region: 'eu-west-2'
})

module.exports = { s3Client }
