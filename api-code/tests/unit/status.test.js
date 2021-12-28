const { expect } = require('chai')
const logs = require('./helpers/logs')
const app = require('../../app.js')
const { modifyInterfaces, resetInterfaces } = require('../../src/helpers/interfaces')
const packageJson = require('../../package.json')

describe('Status Endpoint', () => {
  before(() => {
    logs.capture()
    modifyInterfaces({
      now: () => {
        return new Date('2021-12-05T19:19:23.335Z')
      },
      console
    })
  })

  after(() => {
    resetInterfaces()
    logs.reset()
  })

  it('should report information from package JSON and the current date/time', async () => {
    const actual = await app.default_status({ some: 'event data' })
    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        name: 'boardgames',
        version: packageJson.version,
        description: 'Boardgame Summary API',
        currentDate: '2021-12-05T19:19:23.335Z'
      })
    }
    expect(actual).to.deep.equal(expected)
    expect(logs.get()).to.deep.equal([
      ['log', 'Status endpoint', new Date('2021-12-05T19:19:23.335Z'), { some: 'event data' }]
    ])
  })
})
