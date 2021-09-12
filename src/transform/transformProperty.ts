import transformRef from './transformRef'
import transformObject from './transformObject'
import transformArray from './transformArray'

const transformProperty = (member: any, types: string[], transforms: transforms) => {
  const { schemaTypes } = transforms
  if (types.length > 1) {
    const anyOf: any[] = []
    const includesNonBasicTypes = types.some(t => schemaTypes.includes(t) || t === 'array' || t === 'object')
    if (includesNonBasicTypes) {
      types.forEach((type: string, index: number) => {
        let result
        if (schemaTypes.includes(type)) {
          result = transformRef(type)
        } else if (type === 'object') {
          result = transformObject(member?.type?.types[index], transforms)
        } else if (type === 'array') {
          result = transformArray(member?.type?.types[index], transforms)
        } else {
          result = { type }
        }
        anyOf.push(result)
      })
      return { anyOf }
    }
  } else if (schemaTypes.includes(types[0])) {
    return transformRef(types[0])
  } else if (types[0] === 'object') {
    return transformObject(member?.type || member?.elementType || types[0], transforms)
  } else if (types[0] === 'array') {
    return transformArray(member?.type || member?.elementType || types[0], transforms)
  }

  return ({
    type: types.length === 1 ? types[0] : types
  })
}

export default transformProperty
