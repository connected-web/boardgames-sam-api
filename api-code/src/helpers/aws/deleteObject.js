const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { s3Client } = require('./s3Client')

async function deleteObject ({ Bucket, Key }) {
  let success, failure
  const result = new Promise((resolve, reject) => {
    success = resolve
    failure = reject
  })
  const doc = new DeleteObjectCommand({ Bucket, Key })

  try {
    const response = await s3Client.send(doc)
    success(response)
  } catch (err) {
    failure(err)
  }
  return result
}

module.exports = deleteObject
