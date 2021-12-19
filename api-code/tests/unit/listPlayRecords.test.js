const { expect } = require('chai')
const logs = require('./helpers/logs')
const app = require('../../app.js')
const { modifyInterfaces, resetInterfaces } = require('../../src/helpers/interfaces')

describe.only('List Play Records', () => {
  beforeEach(() => {
    logs.capture()
    modifyInterfaces({
      now () {
        return new Date('2021-12-05T19:19:23.335Z')
      },
      authorizer (event) {
        event.authorized = {
          actions: {
            '/createPlayRecord': 'POST'
          }
        }
      },
      putObject () {
        console.info('Confirm using stub')
        return false
      }
    })
  })

  afterEach(() => {
    resetInterfaces()
    logs.reset()
  })

  it('should return play records from S3', async () => {
    const event = { path: '/playrecords/list', httpMethod: 'GET' }

    const actual = await app.listPlayRecords(event)
    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        playrecords: [{
          game: 'some game',
          winner: 'some winner'
        }]
      })
    }
    expect(actual).to.deep.equal(expected)
    expect(logs.get()).to.deep.equal([
      ['info', 'Confirm using stub'],
      ['log', '[Create Play Record Handler] Successfully stored 49 bytes in boardgames-tracking, 2021/12/2021-12-05T19:19:23.335Z.json']
    ])
  })
})
