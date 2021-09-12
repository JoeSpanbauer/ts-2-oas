import transformRef from './transformRef'
import transformObject from './transformObject'
import transformArray from './transformArray'
import mockTransform from './mockTransform'

const mockRefResult = { $ref: '#/components/schemas/SchemaType'}

const mockObjectResult = {
  type: 'object',
  properties: {
    name: 'type'
  }
}

jest.mock('./transformRef', () => jest.fn(() => mockRefResult))
jest.mock('./transformObject', () => jest.fn(() => mockObjectResult))

describe('Transform data into', () => {
  it('an array of complex type (schema)', () => {
    jest.clearAllMocks()
    const expected = {
      type: 'array',
      items: mockRefResult
    }
    const object = {
      elementType: {
        members: undefined
      }
    }
    const transform = { ...mockTransform, schemaTypes: ['SchemaType'], parseTypes: () => ['SchemaType'] }
    const result = transformArray(object, transform)
    expect(transformRef).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual(expected)
  })
  
  it('an array of complex type (object)', () => {
    jest.clearAllMocks()
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

  it('an array with a schema type', () => {
    jest.clearAllMocks()
    const expected = {
      type: 'array',
      items: {
        anyOf: [mockRefResult, { type: 'undefined' }]
      }
    }
    const object = {
      elementType: {
        members: undefined
      }
    }
    const transform = { ...mockTransform, schemaTypes: ['SchemaType'], parseTypes: () => ['SchemaType', 'undefined'] }
    const result = transformArray(object, transform)
    expect(transformRef).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual(expected)
  })

  it('an array with a basic type', () => {
    jest.clearAllMocks()
    const expected = {
      type: 'array',
      items: {
        anyOf: [{ type: 'string' }, { type: 'number' }]
      }
    }
    const object = {
      elementType: {
        members: undefined
      }
    }
    const transform = { ...mockTransform, schemaTypes: ['SchemaType'], parseTypes: () => ['string', 'number'] }
    const result = transformArray(object, transform)
    // expect(transformRef).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual(expected)
  })
})
