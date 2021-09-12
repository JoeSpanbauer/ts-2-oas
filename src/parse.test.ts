import { SyntaxKind, JsxEmit } from 'typescript'
import { parseStatements, parseTypes, parseName, parseData, astToOas3Type } from './parse'

interface mockMemberData {
  member: {
    name?: {
      escapedText?: string
      text?: string
    }
    type?: {
      kind: SyntaxKind | undefined
      typeName?: {
        escapedText?: string
      }
      types?: {
        kind: SyntaxKind
      }[]
    }
  }
}

interface mockStatementData {
  body: {
    statements: mockStatementData[]
  }
}

describe('Parse statments', () => {
  it('returns the top level statements', () => {
    const testData = [{}, {}, {}]
    const results = parseStatements(testData)
    expect(results).toHaveLength(3)
  })

  it('returns nested statements', () => {
    const testData = [{
      body: {
        statements: [{}]
      }
    }]
    const results = parseStatements(testData)
    expect(results).toHaveLength(1)
  })

  it('restuns both top and nested statements', () => {
    const testData = [{}, {
      body: {
        statements: [{}]
      }
    }]
    const results = parseStatements(testData)
    expect(results).toHaveLength(2)
  })
})

describe('Parse data', () => {
  it('returns the parsed values', () => {
    const expected = {
      name: 'name',
      types: ['boolean']
    }
    const testData: mockMemberData = {
      member: {
        name: {
          escapedText: 'name'
        },
        type: {
          kind: SyntaxKind.BooleanKeyword
        }
      }
    }
    const result = parseData(testData.member)
    expect(result).toEqual(expected)
  })
})

describe('Parse variable name', () => {
  it('with underscores', () => {
    const variable = 'variable_with_underscores'
    const testData: mockMemberData = {
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
    const testData: mockMemberData = {
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
    ['SyntaxKind.ArrayType', astToOas3Type.ArrayType, SyntaxKind.ArrayType],
    ['SyntaxKind.TypeLiteral', astToOas3Type.TypeLiteral, SyntaxKind.TypeLiteral]
  ])('%s value returns array with only %s type', (_, expected, type) => {
    const testData: mockMemberData = {
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

  it('Date type to be string', () => {
    const testData: mockMemberData = {
      member: {
        type: {
          kind: SyntaxKind.TypeReference,
          typeName: {
            escapedText: 'Date'
          }
        }
      }
    }

    const result = parseTypes(testData.member)

    expect(result).toHaveLength(1)
    expect(result![0]).toEqual('string')
  })

  it.each([
    ['SyntaxKind.AnyKeyword', SyntaxKind.AnyKeyword, undefined],
    ['SyntaxKind.ObjectKeyword', SyntaxKind.ObjectKeyword, undefined]
  ])('%s value returns %s', (_, type, expected) => {
    const testData: mockMemberData = {
      member: {
        type: {
          kind: type
        }
      }
    }

    const result = parseTypes(testData.member)

    expect(result).toBe(expected)
  })

  it('SyntaxKind.TypeReference value returns undefined', () => {
    const expected = ['TypeName']
    const testData: mockMemberData = {
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
    const testData: mockMemberData = {
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

  it('Non handled value returns undefined', () => {
    const expected = undefined
    const testData: mockMemberData = {
      member: {
        type: {
          kind: -1
        }
      }
    }

    const result = parseTypes(testData.member)

    expect(result).toEqual(expected)
  })
})