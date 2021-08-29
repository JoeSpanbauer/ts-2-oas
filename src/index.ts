import ts from 'typescript'

import { parseName, parseData, parseTypes } from './parse'
import createSchema from './transform'

module.exports = (fileText: string) => {
    const { statements } = ts.createSourceFile('test.ts', fileText, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
    const schemas = {}
  
    // Collect array of object types
    const schemaTypes: string[] = []
    statements.map(s => {
      schemaTypes.push(parseName(s))
    })
  
    const transforms = { schemaTypes, parseData, parseTypes }
  
    // Iterate through types
    statements.forEach((s: any) => {
      const schema = createSchema(s, transforms)
      const schemaName = parseName(s)
      // @ts-ignore: This is completely dynamic
      schemas[schemaName] = schema
    })

    return JSON.stringify(schemas)
}