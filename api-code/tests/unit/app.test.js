const { expect } = require('chai')
const app = require('../../app.js')

describe('SAM API App', () => {
  describe('Modify Interfaces', () => {
    it('should expose a modifyInterfaces function', () => {
      expect(typeof app.modifyInterfaces).to.equal('function')
    })

    it('should allow the internal interfaces to be altered', () => {
      const newInterface = {
        s3client: {
          async send () {
            return 'hello'
          }
        }
      }
      const originalInterfaces = app.modifyInterfaces(newInterface)
      expect(originalInterfaces.s3client).to.not.equal(newInterface.s3client)
    })

    it('should should expose the resetInterfaces function', () => {
      expect(typeof app.resetInterfaces).to.equal('function')
    })

    it('should allow the internal interfaces to be reset', () => {
      app.resetInterfaces()
    })
  })

  describe('Exports', () => {
    it('should export expected handler functions', () => {
      const actual = Object.keys(app)
      const expected = ['modifyInterfaces', 'resetInterfaces', 'statusHandler', 'playDataHandler']
      expect(actual).to.deep.equal(expected)
    })
  })
})
