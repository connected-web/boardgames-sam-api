const { PutObjectCommand } = require('@aws-sdk/client-s3')
const { s3Client } = require('./src/s3Client.js')

const summaryData = require('./data/boardgame-summaries.json')

let response

exports.summaryHandler = async (event, context) => {
  try {
    // const ret = await axios(url);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        summaryData
        // location: ret.data.trim()
      })
    }
  } catch (err) {
    console.log(err)
    return err
  }

  return response
}

exports.summaryByYearHandler = async (event, context) => {
  const { year } = event.pathParameters
  const selectedYear = summaryData.byYear.filter(item => item.dateCode === year)[0]
  try {
    // const ret = await axios(url);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        data: selectedYear,
        currentYear: year
        // location: ret.data.trim()
      })
    }
  } catch (err) {
    console.log(err)
    return err
  }

  return response
}

exports.playDataHandler = async (event, context) => {
  let payload
  const action = {
    type: 'storePlayData',
    date: new Date()
  }
  if (event.body) {
    payload = JSON.parse(event.body)
  }

  // Set the parameters
  const params = {
    Bucket: 'boardgames-tracking', // The name of the bucket. For example, 'sample_bucket_101'.
    Key: '2021-11-30-test.json', // The name of the object. For example, 'sample_upload.txt'.
    Body: JSON.stringify(payload, null, 2) // The content of the object. For example, 'Hello world!".
  }

  try {
    const results = await s3Client.send(new PutObjectCommand(params))
    console.log(
      'Successfully created ' +
        params.Key +
        ' and uploaded it to ' +
        params.Bucket +
        '/' +
        params.Key
    )
    return results // For unit tests.
  } catch (err) {
    console.log('Error', err)
  }

  try {
    // const ret = await axios(url);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        action, payload
        // location: ret.data.trim()
      })
    }
  } catch (err) {
    console.log(err)
    return err
  }

  return response
}
