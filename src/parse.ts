import { SyntaxKind } from 'typescript'

type astToOas3Type = {
  [key: string]: string
  AnyKeyword: string
  BooleanKeyword: string
  StringKeyword: string
  NumberKeyword: string
  ObjectKeyword: string
  ArrayType: string
  TypeReference: string
  UnionType: string
  UndefinedKeyword: string
}

export const astToOas3Type: astToOas3Type = {
  AnyKeyword: 'any',
  BooleanKeyword: 'boolean',
  StringKeyword: 'string',
  NumberKeyword: 'number',
  ObjectKeyword: 'object',
  ArrayType: 'array',
  TypeReference: 'type',
  UnionType: 'multiple',
  UndefinedKeyword: 'undefined'
}

export const parseName = (member: any) => member.name.escapedText || member.name.text

export const parseTypes = (member: any): Array<string> | undefined => {
  let type = astToOas3Type[SyntaxKind[member.type.kind]]

  if (type === astToOas3Type.TypeReference) {
    type = member.type.typeName.escapedText
  } else if (type === astToOas3Type.UnionType) {
    return member.type.types.map((t: any) => astToOas3Type[SyntaxKind[t.kind]])
  } else if (type === astToOas3Type.AnyKeyword) {
    console.log('Type any is not allowed, plese be more specific.')
    return undefined
  }

  return [type]
}
