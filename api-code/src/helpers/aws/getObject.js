const { GetObjectCommand } = require('@aws-sdk/client-s3')
const { s3Client } = require('./s3Client')

async function getObject ({ Bucket, Key }) {
  let success, failure
  const result = new Promise((resolve, reject) => {
    success = resolve
    failure = reject
  })
  const goc = new GetObjectCommand({ Bucket, Key })

  try {
    const response = await s3Client.send(goc)
    const chunks = []
    response.Body.once('error', err => failure(err))
    response.Body.on('data', chunk => chunks.push(chunk))
    response.Body.once('end', () => success(chunks.join('')))
  } catch (err) {
    failure(err)
  }
  return result
}

module.exports = getObject
