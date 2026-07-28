import { createId } from './id.js'

export function createContract(name, { x = 10, y = 10 } = {}) {
  return {
    schemaVersion: 2,
    id: createId('contract'),
    name,
    x,
    y,
    variables: [],
    structs: [],
    functions: [],
    enums: [],
    guards: [],
    errorDeclarations: [],
    events: [],
    _constructor: null,
    description: '',
  }
}
