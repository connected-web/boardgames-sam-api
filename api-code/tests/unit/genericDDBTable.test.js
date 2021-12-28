const { expect } = require('chai')
const logs = require('./helpers/logs')
const app = require('../../app.js')
const { modifyInterfaces, resetInterfaces } = require('../../src/helpers/interfaces')

describe('Users : Generic DDB Table', () => {
  before(() => {
    logs.capture()
    modifyInterfaces({})
  })

  after(() => {
    resetInterfaces()
    logs.reset()
  })

  it('should process getItem', async () => {
    const event = { path: '/users/getItem/someResource', pathParams: { resourceId: 'someResource' }, httpMethod: 'GET' }
    const actual = await app.users_get(event)
    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        getItem: 'function'
      })
    }
    const actualBody = JSON.parse(actual.body)
    const expectedBody = JSON.parse(expected.body)
    expect(actualBody).to.deep.equal(expectedBody)
  })
})
