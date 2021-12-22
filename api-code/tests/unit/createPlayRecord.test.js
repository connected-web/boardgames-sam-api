const { expect } = require('chai')
const logs = require('./helpers/logs')
const app = require('../../app.js')
const { modifyInterfaces, resetInterfaces } = require('../../src/helpers/interfaces')

describe('Create Play Record', () => {
  beforeEach(() => {
    logs.capture()
    modifyInterfaces({
      now () {
        return new Date('2021-12-05T19:19:23.335Z')
      },
      authorizer (event) {
        event.authorized = {
          actions: {
            '/playrecords/create': 'POST'
          }
        }
      },
      putObject (data) {
        console.info('Confirm using putObject stub:', data.ContentType)
        return false
      }
    })
  })

  afterEach(() => {
    resetInterfaces()
    logs.reset()
  })

  it('should store play data as a file in S3', async () => {
    const payload = {
      some: 'value',
      to: 'store',
      in: 'an s3 bucket'
    }
    const body = JSON.stringify(payload)
    const event = { body, path: '/playrecords/create', httpMethod: 'POST' }

    const actual = await app.playrecords_create(event)
    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Stored play data successfully',
        year: '2021',
        month: '12',
        filename: '2021-12-05T19:19:23.335Z.json',
        keypath: '2021/12/2021-12-05T19:19:23.335Z.json',
        payload
      })
    }
    expect(actual).to.deep.equal(expected)
    expect(logs.get()).to.deep.equal([
      ['info', 'Confirm using putObject stub:', 'application/json; charset=utf-8'],
      ['log', '[Create Play Record] Successfully stored 49 bytes in boardgames-tracking, 2021/12/2021-12-05T19:19:23.335Z.json']
    ])
  })

  it('should generate an error response when an error is thrown writing to S3', async () => {
    modifyInterfaces({
      authorizer (event) {
        event.authorized = {
          actions: {
            '/playrecords/create': 'POST'
          }
        }
      },
      putObject () {
        console.info('Using throw error stub')
        throw new Error('Stub "unable to write to S3" error')
      }
    })
    const payload = { some: 'data' }
    const body = JSON.stringify(payload)
    const event = { body, path: '/playrecords/create', httpMethod: 'POST' }
    const actual = await app.playrecords_create(event)
    const expected = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Unable to store payload: Stub "unable to write to S3" error'
      })
    }
    expect(actual).to.deep.equal(expected)
    expect(logs.get()).to.deep.equal([
      ['info', 'Using throw error stub'],
      ['log', '[Create Play Record] Error', 'Stub "unable to write to S3" error']
    ])
  })
})
