import transformRef from './transformRef'
import transformObject from './transformObject'
import transformArray from './transformArray'
import transformProperty from './transformProperty'

const mockReferenceResult = {
  '$ref': '#/components/schemas/type'
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

// TODO: Move to jest configuration
const mockTransform = { schemaTypes: [], parseData: () => {}, parseTypes: () => {} }

jest.mock('./transformRef', () => jest.fn(() => mockReferenceResult))
jest.mock('./transformObject', () => jest.fn(() => mockObjectResult))
jest.mock('./transformArray', () => jest.fn(() => mockArrayResult))

describe('Transform data into', () => {
  it('a reference type', () => {
    const transforms: transforms = { ...mockTransform, schemaTypes: ['type'] }

    const result = transformProperty(undefined, ['type'], transforms)
    expect(transformRef).toHaveBeenCalledTimes(1)
    expect(result).toBe(mockReferenceResult)
  })

  // TODO: Implement this
  it.todo('multiple reference types')

  it('an object', () => {
    const mockMember = {
      type: undefined
    }
    const result = transformProperty(mockMember, ['object'], mockTransform)
    expect(transformObject).toHaveBeenCalledTimes(1)
    expect(result).toBe(mockObjectResult)
  })

  // TODO: Implement this
  it.todo('multiple object types')

  it('an array', () => {
    const mockMember = {
      type: undefined
    }
    const result = transformProperty(mockMember, ['array'], mockTransform)
    expect(transformArray).toHaveBeenCalledTimes(1)
    expect(result).toBe(mockArrayResult)
  })

  // TODO: Implement this
  it.todo('multiple array types')

  it('a single type', () => {
    const expected = {
      type: 'type'
    }
    const types = ['type']

    const result = transformProperty(undefined, types, mockTransform)
    expect(result).toStrictEqual(expected)
  })
  
  it('multiple types', () => {
    const expected = {
      type: ['type1', 'type2']
    }
    const types = ['type1', 'type2']

    const result = transformProperty(undefined, types, mockTransform)
    expect(result).toStrictEqual(expected)
  })
})
