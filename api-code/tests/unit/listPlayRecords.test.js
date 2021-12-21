const { expect } = require('chai')
const logs = require('./helpers/logs')
const app = require('../../app.js')
const { modifyInterfaces, resetInterfaces } = require('../../src/helpers/interfaces')

describe('List Play Records', () => {
  beforeEach(() => {
    logs.capture()
    modifyInterfaces({
      now () {
        return new Date('2021-12-05T19:19:23.335Z')
      },
      authorizer (event) {
        event.authorized = {
          actions: {
            '/playrecords/list': 'GET'
          }
        }
      },
      async listObjects () {
        console.info('Confirm using listObjects stub')
        return {
          Contents: [{
            Key: 'a.json'
          }, {
            Key: 'b.json'
          }, {
            Key: 'apiKeys.json'
          }, {
            Key: 'not-a-json.txt'
          }]
        }
      },
      async getObject ({ Key }) {
        console.info(`Confirm using getObject stub for ${Key}`)
        return JSON.stringify({
          key: Key,
          game: 'some game',
          winner: 'some winner'
        })
      }
    })
  })

  afterEach(() => {
    resetInterfaces()
    logs.reset()
  })

  it('should return play records from S3', async () => {
    const event = { path: '/playrecords/list', httpMethod: 'GET' }

    const actual = await app.playrecords_list(event)
    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        playRecords: [{
          key: 'a.json',
          game: 'some game',
          winner: 'some winner'
        }, {
          key: 'b.json',
          game: 'some game',
          winner: 'some winner'
        }]
      })
    }
    const actualBody = JSON.parse(actual.body)
    const expectedBody = JSON.parse(expected.body)
    expect(actualBody).to.deep.equal(expectedBody)
    expect(actual).to.deep.equal(expected)
    expect(logs.get()).to.deep.equal([
      ['info', 'Confirm using listObjects stub'],
      ['info', 'Confirm using getObject stub for a.json'],
      ['info', 'Confirm using getObject stub for b.json'],
      ['log', '[List Play Records] Received 119 bytes from S3.']
    ])
  })
})
