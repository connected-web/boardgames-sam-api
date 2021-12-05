const { expect } = require('chai')
const app = require('../../app.js')

describe('SAM API App', () => {
  it('should export expected handler functions', () => {
    const actual = Object.keys(app)
    const expected = ['statusHandler', 'createPlayRecordHandler']
    expect(actual).to.deep.equal(expected)
  })
})
