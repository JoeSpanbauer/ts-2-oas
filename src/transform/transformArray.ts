import createObject from './transformObject'

export default (object: any, transforms: transforms) => {
  let items = {}
  if (object.elementType.members) {
    items = createObject(object.elementType, transforms)
  } else {
    const { parseTypes } = transforms
    items = {
      type: parseTypes(object)
    }
  }

  return {
    type: 'array',
    items
  }
}
