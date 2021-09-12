import transformRef from './transformRef'
import transformObject from './transformObject'
import transformArray from './transformArray'
import transformProperty from './transformProperty'
import mockTransform from './mockTransform'

const mockReferenceResult = {
  '$ref': '#/components/schemas/SchemaType'
}

const mockObjectResult = {
  type: 'object',
  properties: {
    name: 'type'
  }
}

const mockArrayResult = {
  type: 'array',
  items: {}
}

jest.mock('./transformRef', () => jest.fn(() => mockReferenceResult))
jest.mock('./transformObject', () => jest.fn(() => mockObjectResult))
jest.mock('./transformArray', () => jest.fn(() => mockArrayResult))

describe('Transform data into', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('a reference type', () => {
    const transforms = { ...mockTransform, schemaTypes: ['SchemaType'] }

    const result = transformProperty(undefined, ['SchemaType'], transforms)
    expect(transformRef).toHaveBeenCalledTimes(1)
    expect(result).toBe(mockReferenceResult)
  })

  it('an object', () => {
    const mockMember = {
      type: undefined
    }
    const result = transformProperty(mockMember, ['object'], mockTransform)
    expect(transformObject).toHaveBeenCalledTimes(1)
    expect(result).toBe(mockObjectResult)
  })

  it('an array', () => {
    const mockMember = {
      type: undefined
    }
    const result = transformProperty(mockMember, ['array'], mockTransform)
    expect(transformArray).toHaveBeenCalledTimes(1)
    expect(result).toBe(mockArrayResult)
  })

  it('a single type', () => {
    const expected = {
      type: 'type'
    }
    const types = ['type']

    const result = transformProperty(undefined, types, mockTransform)
    expect(result).toStrictEqual(expected)
  })
  
  it('multiple basic types', () => {
    const expected = {
      type: ['type1', 'type2']
    }
    const types = ['type1', 'type2']

    const result = transformProperty(undefined, types, mockTransform)
    expect(result).toStrictEqual(expected)
  })
  
  it('multiple types with a complex type (schema)', () => {
    const expected = {
      anyOf: [
        {
          $ref: "#/components/schemas/SchemaType",
        }, 
        {
          type: 'type2'
        }
      ]
    }
    const types = ['SchemaType', 'type2']

    const transorms = { ...mockTransform, schemaTypes: ['SchemaType'], parseTypes: () => ['SchemaType', 'type2'] }
    const result = transformProperty(undefined, types, transorms)
    expect(transformRef).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual(expected)
  })
  
  it('multiple types with a complex type (object)', () => {
    const expected = {
      anyOf: [
        mockObjectResult, 
        {
          type: 'type2'
        }
      ]
    }
    const types = ['object', 'type2']

    const transorms = { ...mockTransform, parseTypes: () => ['object', 'type2'] }
    const result = transformProperty(undefined, types, transorms)
    expect(transformObject).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual(expected)
  })
  
  it('multiple types with a complex type (array)', () => {
    const expected = {
      anyOf: [
        mockArrayResult, 
        {
          type: 'type2'
        }
      ]
    }
    const types = ['array', 'type2']

    const transorms = { ...mockTransform, parseTypes: () => ['array', 'type2'] }
    const result = transformProperty(undefined, types, transorms)
    expect(transformArray).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual(expected)
  })
})
