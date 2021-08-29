import ts from 'typescript'
import fs from 'fs'

import { parseName, parseData, parseTypes } from './parse'
import createSchema from './transform'

const filePath = process.argv[2] || 'C:/git/ts-2-oas/src/types.ts'

// import yaml from 'js-yaml'
// console.log(yaml.dump({ yup: { nope: 3, maybe: ['1','2','3']}}))

fs.readFile(filePath, 'utf8', (err: any, data: any) => {
  const { statements } = ts.createSourceFile('test.ts', data, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
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

  console.log('schemas', JSON.stringify(schemas))
})