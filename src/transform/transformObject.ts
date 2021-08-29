import transformProperty from './transformProperty'

export default (object: any, transforms: transforms) => {
  const obj = {
    type: 'object',
    properties: {}
  }
  const { parseData } = transforms
  object.members.forEach((m: any) => {
    const { name, types } = parseData(m)

    // @ts-ignore: This is completely dynamic
    obj.properties[name] = types ? transformProperty(m, types, transforms) : undefined
  })

  return obj
}
