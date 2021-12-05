const { expect } = require('chai')
const app = require('../../app.js')

const endpoints = Object.values(app)

describe('SAM API App', () => {
  describe('Exported Handlers', () => {
    it('should export expected handler functions', () => {
      const actual = Object.keys(app)
      const expected = ['statusHandler', 'createPlayRecordHandler']
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
