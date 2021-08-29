import transformProperty from './transformProperty'
import transformObject from './transformObject'

const mockPropertyResult = 'type'

// TODO: Move to jest configuration
const mockTransform = { schemaTypes: [], parseData: () => {}, parseTypes: () => {} }

jest.mock('./transformProperty', () => jest.fn(() => mockPropertyResult))

describe('Transform data into', () => {
  it('an empty object', () => {
    const expected = {
      type: 'object',
      properties: {}
    }
    const emptyObjectData = { members: [] }
    const result = transformObject(emptyObjectData, mockTransform)
    expect(result).toStrictEqual(expected)
  })

  it('an object with type data', () => {
    const expected = {
      type: 'object',
      properties: {
        name: 'type'
      }
    }
    const objectData = { members: [{  }] }
    const transform = {
      ...mockTransform,
      parseData: () => ({
        name: 'name',
        types: []
      })
    }
    const result = transformObject(objectData, transform)
    expect(transformProperty).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual(expected)
  })
})
