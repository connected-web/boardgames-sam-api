const { expect } = require('chai')
const app = require('../../app.js')

const endpoints = Object.values(app)

describe('SAM API App', () => {
  describe('Exported Endpoints', () => {
    it('should export expected endpoints functions', () => {
      const actual = Object.keys(app)
      const expected = ['default.status', 'playrecords.create', 'playrecords.list', 'users.list']
      expect(actual).to.deep.equal(expected)
    })
  })

  endpoints.forEach(endpoint => {
    describe(`${endpoint.routeName} Endpoint`, () => {
      it('each endpoint should have a routeName, routePath, and routeMethod', () => {
        expect(endpoint.routeName).to.not.equal('')
        expect(endpoint.routePath).to.match(/^[/A-z-]+$/)
        expect(endpoint.routeMethod).to.match(/^(GET|POST)$/)
      })
    })
  })
})
