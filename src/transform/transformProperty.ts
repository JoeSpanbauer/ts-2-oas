import transformRef from './transformRef'
import transformObject from './transformObject'
import transformArray from './transformArray'

export default (member: any, types: string[], transforms: transforms) => {
  const { schemaTypes } = transforms
  if (schemaTypes.includes(types[0])) {
    return transformRef(types[0])
  } else if (types[0] === 'object') {
    return transformObject(member.type, transforms)
  } else if (types[0] === 'array') {
    return transformArray(member.type, transforms)
  }

  return ({
    type: types.length === 1 ? types[0] : types
  })
}
