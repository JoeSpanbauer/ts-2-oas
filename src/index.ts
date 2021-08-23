import ts from 'typescript'
import fs from 'fs'

import { parseName, parseTypes } from './parse'

const filePath = process.argv[2] || 'C:/git/ts-2-oas/src/types.ts'

fs.readFile(filePath, 'utf8', (err: any, data: any) => {
  const { statements } = ts.createSourceFile('test.ts', data, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)

  // Collect array of object types
  const types: string[] = []
  statements.map(s => {
    types.push(parseName(s))
  })

  // Iterate through types
  statements.forEach((s: any) => {
    const schema = {}
    s.members.forEach((m: any) => {
      const type = parseTypes(m)
      if (!type) {
      } else {
        console.log(`${parseName(m)} is of type ${type}`)
        type.forEach((t: any) => {
          console.log(`type ${t} ${types.includes(t) === false ? 'is not' : 'is'} contained in the types array`)
        })
      }
    })
  })
})