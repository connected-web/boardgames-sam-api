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
    if (CALI_API_USER && CALI_API_USER_KEY) {
      const url = `${API_SERVER}/users/list`
      try {
        const response = await axios.get(url, {
          headers: {
            'Calisaurus-User': CALI_API_USER,
            'Calisaurus-User-Api-Key': CALI_API_USER_KEY
          }
        })
        expect(response.data).to.deep.equal({ some: 'list of users ' })
      } catch (ex) {
        expect(ex?.response?.data).to.deep.equal({ ...ex.response.headers })
      }
    } else {
      throw new Error('Expected keys: CALI_API_USER and CALI_API_USER_KEY need to be set on your environment to run this test.')
    }
  })
})
