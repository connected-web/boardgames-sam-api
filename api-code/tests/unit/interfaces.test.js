const { expect } = require('chai')
const interfaces = require('../../src/helpers/interfaces')

describe('Interfaces', () => {
  it('should expose a modifyInterfaces function', () => {
    expect(typeof interfaces.modifyInterfaces).to.equal('function')
  })

  it('should expose the resetInterfaces function', () => {
    expect(typeof interfaces.resetInterfaces).to.equal('function')
  })

  it('should expose the get function', () => {
    expect(typeof interfaces.get).to.equal('function')
  })

  it('should allow the internal interfaces to be altered', () => {
    const newInterface = {
      s3client: {
        async send () {
          return 'hello'
        }
      }
    }
    const originalInterfaces = interfaces.modifyInterfaces(newInterface)
    expect(originalInterfaces.s3client).to.not.equal(newInterface.s3client)
  })

  it('should allow the internal interfaces to be reset', () => {
    const stateBefore = interfaces.get()
    interfaces.resetInterfaces()
    const stateAfter = interfaces.get()
    expect(stateAfter).to.equal(stateBefore)
  })
})
