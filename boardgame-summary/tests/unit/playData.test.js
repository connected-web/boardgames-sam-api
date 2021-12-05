const { expect } = require('chai')
const logs = require('./helpers/logs')
const app = require('../../app.js')

describe('Play Data Handler', () => {
  before(() => {
    logs.capture()
    app.modifyInterfaces({
      now () {
        return new Date('2021-12-05T19:19:23.335Z')
      },
      console
    })
  })

  after(() => {
    app.resetInterfaces()
    logs.reset()
  })

  it('should store play data as a file in S3', async () => {
    const payload = {
      some: 'value',
      to: 'store',
      in: 'an s3 bucket'
    }
    const body = JSON.stringify(payload)
    const event = { body }

    const actual = await app.playDataHandler(event)
    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Stored play data successfully',
        folder: '2021-12',
        filename: '2021-12-05T19:19:23.335Z.json',
        keypath: '2021-12/2021-12-05T19:19:23.335Z.json',
        payload
      })
    }
    expect(actual).to.deep.equal(expected)
    const logLines = logs.get()
    expect(logLines).to.deep.equal([
      ['log', '[Play Data Handler] Successfully stored 49 bytes in boardgames-tracking, 2021-12/2021-12-05T19:19:23.335Z.json']
    ])
  })
})
