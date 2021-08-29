interface AllTypes {
  any: any
  object: object
  boolean: boolean
  string: string
  number: number
  stringArray: string[]
  allTypes: AllTypes
  variable_with_underscores: string
  'variable-with-hyphens': string
  'variable with spaces': string
  'variableWith$pecialCharacter': string
  optionalTypes: OptionalTypes
  custom: {
    int: number
  }
  special: {
    type: string
  }[]
  // params?: Map<string, any> | undefined
}

interface OptionalTypes {
  stringNumber: string | number
  boolNumber: boolean | number
}