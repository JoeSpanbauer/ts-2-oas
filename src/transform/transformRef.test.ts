import createRef from './transformRef'

describe('Transform data into', () => {
  it('a reference to a schema type', () => {
    const expected = '#/components/schemas/type'
    const result = createRef('type')
    expect(result['$ref']).toEqual(expected)
  })
})
