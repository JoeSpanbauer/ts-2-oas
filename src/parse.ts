import { SyntaxKind } from 'typescript'

type astToOas3Type = {
  [key: string]: string
  AnyKeyword: string
  BooleanKeyword: string
  StringKeyword: string
  NumberKeyword: string
  ArrayType: string
  TypeLiteral: string
  TypeReference: string
  UnionType: string
  UndefinedKeyword: string
}

export const astToOas3Type: astToOas3Type = {
  AnyKeyword: 'any',
  BooleanKeyword: 'boolean',
  StringKeyword: 'string',
  NumberKeyword: 'number',
  ArrayType: 'array',
  TypeLiteral: 'object',
  TypeReference: 'type',
  UnionType: 'multiple',
  UndefinedKeyword: 'undefined'
}

type typeData = {
  name: string,
  type: string
}

export const parseStatements = (_statements: any) => {
  let statements: any[] = []
  _statements.forEach((statement: any) => {
    if (statement?.body?.statements) {
      statements = statements.concat(parseStatements(statement?.body?.statements))
    } else {
      statements.push(statement)
    }
  })

  return statements
}

export const parseName = (member: any) => member?.name?.escapedText || member?.name?.text

export const getKind = (member: any) => member?.elementType?.kind || member?.type?.kind

export const parseTypes = (member: any): Array<string> | undefined => {
  const kind = getKind(member)
  let type = astToOas3Type[SyntaxKind[kind]]

  if (type === astToOas3Type.TypeReference) {
    type = member?.type?.typeName?.escapedText || member?.elementType?.typeName?.escapedText
    if (type === 'Date') {
      type = 'string'
    }
  } else if (type === astToOas3Type.UnionType) {
    return member.type.types.map((t: any) => {
      const result = astToOas3Type[SyntaxKind[t.kind]]
      return result === 'type' ? t.typeName.escapedText : result
    })
  } else if (type === astToOas3Type.AnyKeyword) {
    console.log('Type any is not allowed, plese be more specific.')
    return undefined
  } else if (!type) {
    console.log(`Type not found for kind ${SyntaxKind[kind]}.`)
    return undefined
  }

  return [type]
}

export const parseData = (member: any) => {
  return {
    name: parseName(member),
    types: parseTypes(member)
  }
}
