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
  let action, payload
  try {
    action = {
      type: 'storePlayData',
      date: new Date()
    }
    if (event.body) {
      payload = JSON.parse(event.body)
    }
  } catch (ex) {
    console.error('Play data handler: unable to parse payload', ex.message)
  }

  // Set the parameters
  // 2021-12-01T23:15:12.json
  // 2021-12-01T23:11:25.556Z.json
  const currentDate = new Date()
  const filename = `${currentDate.toISOString()}.json`
  const params = {
    Bucket: 'boardgames-tracking', // The name of the bucket. For example, 'sample_bucket_101'.
    Key: filename, // The name of the object. For example, 'sample_upload.txt'.
    Body: JSON.stringify(payload || event, null, 2) // The content of the object. For example, 'Hello world!".
  }

  try {
    await s3Client.send(new PutObjectCommand(params))
    console.log(
      'Successfully created ' +
        params.Key +
        ' and uploaded it to ' +
        params.Bucket +
        '/' +
        params.Key
    )
  } catch (err) {
    console.log('Error', err)
  }

  try {
    // const ret = await axios(url);
    response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
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
