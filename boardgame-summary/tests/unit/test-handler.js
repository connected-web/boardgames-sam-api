/* eslint-env mocha */

const app = require('../../app.js')
const chai = require('chai')
const expect = chai.expect
var event, context

describe('Tests index', function () {
  it('verifies successful response', async () => {
    const result = await app.summaryHandler(event, context)

    expect(result).to.be.an('object')
    expect(result.statusCode).to.equal(200)
    expect(result.body).to.be.an('string')

    const response = JSON.parse(result.body)

    expect(response.summaryData).to.be.an('object')
    expect(response.summaryData.byMonth).to.be.an('array')
    expect(response.summaryData.byMonth.length).to.be.greaterThan(12)
    // expect(response.location).to.be.an("string");
  })
})
