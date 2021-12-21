const { PutObjectCommand } = require('@aws-sdk/client-s3')
const { s3Client } = require('./s3Client')

async function putObject ({ Bucket, Key, Body }) {
  const params = { Bucket, Key, Body }
  const poc = new PutObjectCommand(params)
  return s3Client.send(poc)
}

module.exports = putObject
