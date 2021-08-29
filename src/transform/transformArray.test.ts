import transformObject from './transformObject'
import transformArray from './transformArray'

const mockObjectResult = {
  type: 'object',
  properties: {
    name: 'type'
  }
}

// TODO: Move to jest configuration
const mockTransform = { schemaTypes: [], parseData: () => {}, parseTypes: () => {} }

jest.mock('./transformObject', () => jest.fn(() => mockObjectResult))

describe('Transform data into', () => {
  it('an array of complex type (object)', () => {
    const expected = {
      type: 'array',
      items: { ...mockObjectResult }
    }
    const object = {
      elementType: {
        members: []
      }
    }
    const result = transformArray(object, mockTransform)
    expect(transformObject).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual(expected)
  })
  
  it('an array of base type (string)', () => {
    const expected = {
      type: 'array',
      items: {
        type: 'string'
      }
    }
    const object = {
      elementType: {}
    }
    const transform = { ...mockTransform, parseTypes: () => 'string' }
    const result = transformArray(object, transform)
    expect(result).toStrictEqual(expected)
  })
})
