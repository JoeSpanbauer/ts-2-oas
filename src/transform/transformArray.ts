import transformRef from './transformRef'
import createObject from './transformObject'

export default (object: any, transforms: transforms) => {
  let items = {}
  if (object.elementType.members) {
    items = createObject(object.elementType, transforms)
  } else {
    const { schemaTypes, parseTypes } = transforms
    const types = parseTypes(object)
    if (schemaTypes.includes(types[0])) {
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
