const { expect } = require('chai')
const logs = require('./helpers/logs')
const app = require('../../app.js')
const { modifyInterfaces, resetInterfaces } = require('../../src/helpers/interfaces')

describe('Delete Play Record', () => {
  beforeEach(() => {
    logs.capture()
    modifyInterfaces({
      authorizer (event) {
        event.authorized = {
          actions: {
            '/playrecords/delete': 'DELETE'
          }
        }
      },
      deleteObject () {
        console.info('Confirm delete object using stub')
        return false
      }
    })
  })

  afterEach(() => {
    resetInterfaces()
    logs.reset()
  })

  it('should delete a play record file from S3', async () => {
    const payload = {
      keypath: '2101/12/2021-12-05T19:19:23.335Z-some-idempotent-key.json'
    }
    const body = JSON.stringify(payload)
    const event = { body, path: '/playrecords/delete', httpMethod: 'DELETE' }

    const actual = await app.playrecords_delete(event)
    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Play record deleted successfully',
        keypath: '2101/12/2021-12-05T19:19:23.335Z-some-idempotent-key.json'
      })
    }
    const actualBody = JSON.parse(actual.body)
    const expectedBody = JSON.parse(expected.body)
    expect(actualBody).to.deep.equal(expectedBody)
    expect(actual).to.deep.equal(expected)
    expect(logs.get()).to.deep.equal([
      ['info', 'Confirm delete object using stub'],
      ['log', '[Delete Play Record] Successfully removed 2101/12/2021-12-05T19:19:23.335Z-some-idempotent-key.json from boardgames-tracking']
    ])
  })

  it('should generate an error response when an empty keypath is provided', async () => {
    modifyInterfaces({
      deleteObject () {
        console.info('Using throw error stub')
        throw new Error('Stub "unable to write to S3" error')
      }
    })
    const payload = { keypath: '' }
    const body = JSON.stringify(payload)
    const event = { body, path: '/playrecords/delete', httpMethod: 'DELETE' }
    const actual = await app.playrecords_delete(event)
    const expected = {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Unable to delete play record: Empty keypath provided in payload ()'
      })
    }
    const actualBody = JSON.parse(actual.body)
    const expectedBody = JSON.parse(expected.body)
    expect(actualBody).to.deep.equal(expectedBody)
    expect(actual).to.deep.equal(expected)
    expect(logs.get()).to.deep.equal([
      ['log', '[Delete Play Record] Client error', 'Unable to delete play record: Empty keypath provided in payload ()']
    ])
  })
})
