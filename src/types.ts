interface AllTypes {
  any: any
  boolean: boolean
  string: string
  number: number
  object: object
  objectArray: object[]
  allTypes: AllTypes
  variable_with_underscores: string
  "variable-with-hyphens": string
  "variable with spaces": string
  "variable with $pecial character": string
  optionalTypes: OptionalTypes
  // params?: Map<string, any> | undefined
}

interface OptionalTypes {
  stringNumber: string | number
  boolObject: boolean | object
}