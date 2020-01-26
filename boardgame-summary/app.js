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
