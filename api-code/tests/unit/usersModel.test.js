const { expect } = require('chai')
const logs = require('./helpers/logs')
const app = require('../../app.js')
const { modifyInterfaces, resetInterfaces } = require('../../src/helpers/interfaces')

describe('Users Model', () => {
  before(() => {
    logs.capture()
    modifyInterfaces({
      dynamo: {
        getItem (params, fn) {
          if (params.Key.id === 'someResource') {
            return fn(null, {
              Item: {
                resourceId: 'someResource',
                doc: JSON.stringify({
                  some: 'value',
                  to: 'store',
                  in: 'dynamo db'
                })
              }
            })
          } else {
            return fn(null, { params })
          }
        },
        putItem (params, fn) {
          return fn(null, { params })
        },
        deleteItem (params, fn) {
          return fn(null, { params })
        }
      }
    })
  })

  after(() => {
    resetInterfaces()
    logs.reset()
  })

  it('should return no data for a missing item read via getItem', async () => {
    const event = { path: '/users/get/noResource', pathParameters: { resourceId: 'noResource' }, httpMethod: 'GET' }
    const actual = await app.users_get(event)
    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        resourceId: 'noResource',
        doc: {
          data: 'no data'
        }
      })
    }
    const actualBody = JSON.parse(actual.body)
    const expectedBody = JSON.parse(expected.body)
    expect(actualBody).to.deep.equal(expectedBody)
  })

  it('should allow an item to be read via getItem', async () => {
    const event = { path: '/users/get/someResource', pathParameters: { resourceId: 'someResource' }, httpMethod: 'GET' }
    const actual = await app.users_get(event)
    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        resourceId: 'someResource',
        doc: JSON.stringify({
          some: 'value',
          to: 'store',
          in: 'dynamo db'
        })
      })
    }
    const actualBody = JSON.parse(actual.body)
    const expectedBody = JSON.parse(expected.body)
    expect(actualBody).to.deep.equal(expectedBody)
  })

  it('should allow an item to be stored via createItem', async () => {
    const payload = {
      some: 'value',
      to: 'store',
      in: 'dynamo db'
    }
    const body = JSON.stringify(payload)
    const event = { body, path: '/users/create/someResource', pathParameters: { resourceId: 'someResource' }, httpMethod: 'GET' }
    const actual = await app.users_create(event)
    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        id: 'someResource',
        doc: JSON.stringify({
          some: 'value',
          to: 'store',
          in: 'dynamo db'
        })
      })
    }
    const actualBody = JSON.parse(actual.body)
    const expectedBody = JSON.parse(expected.body)
    expect(actualBody).to.deep.equal(expectedBody)
  })
})
