const { expect } = require('chai')
const logs = require('./helpers/logs')
const app = require('../../app.js')
const { modifyInterfaces, resetInterfaces } = require('../../src/helpers/interfaces')

describe('Users Model', () => {
  before(() => {
    logs.capture()
    modifyInterfaces({})
  })

  after(() => {
    resetInterfaces()
    logs.reset()
  })

  it('should allow an item to be read via getItem', async () => {
    const event = { path: '/users/getItem/someResource', pathParameters: { resourceId: 'someResource' }, httpMethod: 'GET' }
    const actual = await app.users_get(event)
    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        resourceId: 'someResource',
        doc: {
          data: 'no data'
        }
      })
    }
    const actualBody = JSON.parse(actual.body)
    const expectedBody = JSON.parse(expected.body)
    expect(actualBody).to.deep.equal(expectedBody)
  })
})
