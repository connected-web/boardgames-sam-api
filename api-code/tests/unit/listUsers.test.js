const { expect } = require('chai')
const logs = require('./helpers/logs')
const app = require('../../app.js')
const { modifyInterfaces, resetInterfaces } = require('../../src/helpers/interfaces')

describe('List Users', () => {
  before(() => {
    logs.capture()
    modifyInterfaces({
      getObject () {
        return JSON.stringify([
          { user: 'Bob' },
          { user: 'Anna' }
        ])
      },
      authorizer (event) {
        event.authorized = {
          actions: {
            '/list/users': 'GET'
          }
        }
      },
      console
    })
  })

  after(() => {
    resetInterfaces()
    logs.reset()
  })

  it('should list users who have available access tokens', async () => {
    const actual = await app.users_list({ some: 'event data', path: '/list/users', httpMethod: 'GET' })
    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        users: ['Bob', 'Anna']
      })
    }
    const actualBody = JSON.parse(actual.body)
    const expectedBody = JSON.parse(expected.body)
    expect(actualBody).to.deep.equal(expectedBody)
    expect(actual).to.deep.equal(expected)

    expect(logs.get()).to.deep.equal([
      ['log', '[List Users] Read 32 bytes from S3 config.']
    ])
  })
})
