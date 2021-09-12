type Thing = {
  body: string
}

interface AllTypes {
  any: any
  object: object
  boolean: boolean
  string: string
  number: number
  stringArray: string[]
  variable_with_underscores: string
  'variable-with-hyphens': string
  'variable with spaces': string
  'variableWith$pecialCharacter': string
  allTypes: AllTypes
  optionalTypesArray: OptionalTypes[]
  optionalTypes: OptionalTypes
  custom: {
    int: number
  }
  special: {
    type: string
  }[]
  date: Date
  // params?: Map<string, any> | undefined
}

interface OptionalTypes {
  stringNumber: string | number
  boolNumber: boolean | number
}

interface Complex {
    optionalUndefined: OptionalTypes | undefined
    arrayUndefined: string[] | undefined
    objectUndefined: {
        word: string
    } | undefined
    // TODO: This doesn't work yet
    arrayTypes: Array<string | number>
}