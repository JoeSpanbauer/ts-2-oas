import { SyntaxKind } from 'typescript'
import { parseTypes, parseName, astToOas3Type } from './parse'

interface mockTestData {
  member: {
    name?: {
      escapedText?: string
      text?: string
    }
    type?: {
      kind: SyntaxKind
      typeName?: {
        escapedText?: string
      }
      types?: {
        kind: SyntaxKind
      }[]
    }
  }
}

describe('Parse variable name', () => {
  it('with underscores', () => {
    const variable = 'variable_with_underscores'
    const testData: mockTestData = {
      member: {
        name: {
          escapedText: variable
        }
      }
    }

    const result = parseName(testData.member)

    expect(result).toEqual(variable)
  })

  it.each([
    ['with hyphens', 'variable-with-hyphens'],
    ['with spaces', 'variable with spaces'],
    ['with special characters', 'variable with $pecial character'],
  ])('%s', (_, variable) => {
    const testData: mockTestData = {
      member: {
        name: {
          text: variable
        }
      }
    }

    const result = parseName(testData.member)

    expect(result).toEqual(variable)
  })
})

describe('Parse type for', () => {
  it.each([
    ['SyntaxKind.UndefinedKeyword', astToOas3Type.UndefinedKeyword, SyntaxKind.UndefinedKeyword],
    ['SyntaxKind.BooleanKeyword', astToOas3Type.BooleanKeyword, SyntaxKind.BooleanKeyword],
    ['SyntaxKind.StringKeyword', astToOas3Type.StringKeyword, SyntaxKind.StringKeyword],
    ['SyntaxKind.NumberKeyword', astToOas3Type.NumberKeyword, SyntaxKind.NumberKeyword],
    ['SyntaxKind.ObjectKeyword', astToOas3Type.ObjectKeyword, SyntaxKind.ObjectKeyword],
    ['SyntaxKind.ArrayType', astToOas3Type.ArrayType, SyntaxKind.ArrayType]
  ])('%s value returns array with only %s type', (_, expected, type) => {
    const testData: mockTestData = {
      member: {
        type: {
          kind: type
        }
      }
    }

    const result = parseTypes(testData.member)

    expect(result).toHaveLength(1)
    expect(result![0]).toEqual(expected)
  })

  it('SyntaxKind.AnyKeyword value returns type', () => {
    const testData: mockTestData = {
      member: {
        type: {
          kind: SyntaxKind.AnyKeyword
        }
      }
    }

    const result = parseTypes(testData.member)

    expect(result).toBe(undefined)
  })

  it('SyntaxKind.TypeReference value returns undefined', () => {
    const expected = ['TypeName']
    const testData: mockTestData = {
      member: {
        type: {
          kind: SyntaxKind.TypeReference,
          typeName: {
            escapedText: expected[0]
          }
        }
      }
    }

    const result = parseTypes(testData.member)

    expect(result).toStrictEqual(expected)
  })

  it('SyntaxKind.UnionType value returns array of types', () => {
    const expected = ['boolean', 'undefined']
    const testData: mockTestData = {
      member: {
        type: {
          kind: SyntaxKind.UnionType,
          types: [
            {
              kind: SyntaxKind.BooleanKeyword
            },
            {
              kind: SyntaxKind.UndefinedKeyword
            }
          ]
        }
      }
    }

    const result = parseTypes(testData.member)

    expect(result).toHaveLength(2)
    expect(result).toEqual(expected)
  })
})