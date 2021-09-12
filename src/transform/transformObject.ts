import transformProperty from './transformProperty'

const transformObject = (object: any, transforms: transforms) => {
  let obj: any
  const { parseData } = transforms
  const members = object?.members || object?.type?.members
  obj = {
    type: 'object',
    properties: {}
  }

  members?.forEach((m: any) => {
    const { name, types } = parseData(m)

    // @ts-ignore: This is completely dynamic
    obj.properties[name] = types ? transformProperty(m, types, transforms) : undefined
  })

  return obj
}
export default transformObject
