const { ListObjectsV2Command } = require('@aws-sdk/client-s3')
const { s3Client } = require('./s3Client')

async function listObjects ({ Bucket, Prefix }) {
  let success, failure
  const result = new Promise((resolve, reject) => {
    success = resolve
    failure = reject
  })
  const listObjectsCommand = new ListObjectsV2Command({ Bucket, Prefix })

  try {
    const response = await s3Client.send(listObjectsCommand)
    success(response)
  } catch (err) {
    failure(err)
  }
  return result
}

module.exports = listObjects
