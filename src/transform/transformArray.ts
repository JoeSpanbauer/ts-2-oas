import transformRef from './transformRef'
import createObject from './transformObject'

export default (object: any, transforms: transforms) => {
  let items = {}
  if (object?.elementType?.members) {
    items = createObject(object.elementType, transforms)
  } else {
    const { schemaTypes, parseTypes } = transforms
    const types = parseTypes(object)
    if (Array.isArray(types) && types.length > 1) {
      const anyOf: any[] = []
      types.forEach((type: string) => {
        if (schemaTypes.includes(type)) {
          anyOf.push(transformRef(type))
        } else {
          anyOf.push({ type })
        }
      })
      items = {
        anyOf
      }
    } else if (Array.isArray(types) && schemaTypes.includes(types[0])) {
      items = transformRef(types[0])
    } else {
      items = {
        type: types
      }
    }
  }

  return {
    type: 'array',
    items
  }
}
