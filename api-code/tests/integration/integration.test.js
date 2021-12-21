const { expect } = require('chai')
const axios = require('axios')

const API_SERVER = process.env.API_SERVER || 'https://nn58gn0krl.execute-api.eu-west-2.amazonaws.com/Prod'

describe('Status endpoint', () => {
  it('should download status information from the API', async () => {
    const url = `${API_SERVER}/status`
    const response = await axios.get(url)
    const { name, version, description } = response.data
    const actual = { name, version, description }
    const expected = {
      name: 'boardgames',
      version: '1.0.0',
      description: 'Boardgame Summary API'
    }
    expect(actual).to.deep.equal(expected)
  })
})

describe('Fully authorized request', () => {
  it('should GET a list of users from the remote server', async () => {
    const { CALI_API_USER, CALI_API_USER_KEY } = process.env
    let response
    if (CALI_API_USER && CALI_API_USER_KEY) {
      const url = `${API_SERVER}/users/list`
      const headers = {
        'calisaurus-user': CALI_API_USER,
        'calisaurus-user-api-key': CALI_API_USER_KEY
      }
      try {
        response = await axios.get(url, { headers })
      } catch (ex) {
        response = ex.response
      }
      expect(response.data).to.deep.equal({
        users: [
          'Hannah',
          'John'
        ]
      })
    } else {
      throw new Error('Expected keys: CALI_API_USER and CALI_API_USER_KEY need to be set on your environment to run this test.')
    }
  })

  it('should GET a list of play records from the remote server', async () => {
    const { CALI_API_USER, CALI_API_USER_KEY } = process.env
    let response
    if (CALI_API_USER && CALI_API_USER_KEY) {
      const url = `${API_SERVER}/playrecords/list`
      const headers = {
        'calisaurus-user': CALI_API_USER,
        'calisaurus-user-api-key': CALI_API_USER_KEY
      }
      try {
        response = await axios.get(url, { headers })
      } catch (ex) {
        response = ex.response
      }
      const actual = response.data
      expect(actual).to.deep.equal({
        playRecords: []
      })
    } else {
      throw new Error('Expected keys: CALI_API_USER and CALI_API_USER_KEY need to be set on your environment to run this test.')
    }
  })
})
