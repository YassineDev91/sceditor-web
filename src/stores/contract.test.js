import { beforeEach, describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useContractStorage } from './contract.js'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('initNewContract', () => {
  it('creates a schema-v2 contract with a populated constructor', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    expect(store.contract.schemaVersion).toBe(2)
    expect(store.contract.name).toBe('Purchase')
    expect(store.contract._constructor).not.toBeNull()
    expect(store.contract._constructor.cmp_type).toBe('Constructor')
    expect(store.contract.guards).toEqual([])
    expect(store.contract.events).toEqual([])
  })

  it('records the creation in history', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    expect(store.historyIndex).toBeGreaterThanOrEqual(0)
  })
})

describe('element-creation actions', () => {
  it('createVariableElement pushes a Variable with a string primitive type', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    store.createVariableElement({ x: 10, y: 20 })
    expect(store.contract.variables).toHaveLength(1)
    expect(store.contract.variables[0].cmp_type).toBe('Variable')
    expect(store.contract.variables[0].type).toEqual({ kind: 'primitive', name: 'string' })
    expect(store.contract.variables[0].x).toBe(10)
  })

  it('createStructElement pushes a Struct', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    store.createStructElement({ x: 1, y: 2 })
    expect(store.contract.structs).toHaveLength(1)
    expect(store.contract.structs[0].cmp_type).toBe('Struct')
  })

  it('createFunctionElement pushes a Function', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    store.createFunctionElement({ x: 1, y: 2 })
    expect(store.contract.functions).toHaveLength(1)
    expect(store.contract.functions[0].cmp_type).toBe('Function')
  })

  it('createEnumElement pushes an Enum', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    store.createEnumElement({ x: 1, y: 2 })
    expect(store.contract.enums).toHaveLength(1)
    expect(store.contract.enums[0].cmp_type).toBe('Enum')
  })

  it('createGuardElement pushes onto contract.guards', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    store.createGuardElement({ x: 1, y: 2 })
    expect(store.contract.guards).toHaveLength(1)
    expect(store.contract.guards[0].cmp_type).toBe('Guard')
  })

  it('createErrorDeclarationElement pushes an ErrorDeclaration', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    store.createErrorDeclarationElement({ x: 1, y: 2 })
    expect(store.contract.errorDeclarations).toHaveLength(1)
    expect(store.contract.errorDeclarations[0].cmp_type).toBe('ErrorDeclaration')
  })

  it('createEventElement pushes onto contract.events', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    store.createEventElement({ x: 1, y: 2 })
    expect(store.contract.events).toHaveLength(1)
    expect(store.contract.events[0].cmp_type).toBe('Event')
  })
})

describe('selectAll', () => {
  it('includes guards and events', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    store.createGuardElement({ x: 0, y: 0 })
    store.createEventElement({ x: 0, y: 0 })
    store.selectAll()
    // 3, not 2: initNewContract populates _constructor, and selectAll's
    // brief-specified implementation always includes it when present
    // (Guard + Event + Constructor). See task-2-report.md for details.
    expect(store.selectedElements).toHaveLength(3)
    expect(store.selectedElements).toEqual(
      expect.arrayContaining([store.contract.guards[0], store.contract.events[0]])
    )
  })
})

describe('deleteElement', () => {
  it('deletes a Guard from contract.guards', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    store.createGuardElement({ x: 0, y: 0 })
    store.showProperties(store.contract.guards[0])
    const originalConfirm = globalThis.confirm
    globalThis.confirm = () => true
    store.deleteElement()
    globalThis.confirm = originalConfirm
    expect(store.contract.guards).toHaveLength(0)
  })

  it('deletes an Event from contract.events', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    store.createEventElement({ x: 0, y: 0 })
    store.showProperties(store.contract.events[0])
    const originalConfirm = globalThis.confirm
    globalThis.confirm = () => true
    store.deleteElement()
    globalThis.confirm = originalConfirm
    expect(store.contract.events).toHaveLength(0)
  })
})

describe('updatePosition', () => {
  it('updates the position of a Guard by id', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    store.createGuardElement({ x: 0, y: 0 })
    const id = store.contract.guards[0].id
    store.updatePosition(id, 111, 222)
    expect(store.contract.guards[0].x).toBe(111)
    expect(store.contract.guards[0].y).toBe(222)
  })

  it('updates the position of the constructor via _constructor, not the inherited constructor property', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    const id = store.contract._constructor.id
    store.updatePosition(id, 50, 60)
    expect(store.contract._constructor.x).toBe(50)
    expect(store.contract._constructor.y).toBe(60)
  })

  it('updates the position of an Event by id', () => {
    const store = useContractStorage()
    store.initNewContract('Purchase')
    store.createEventElement({ x: 0, y: 0 })
    const id = store.contract.events[0].id
    store.updatePosition(id, 5, 6)
    expect(store.contract.events[0].x).toBe(5)
    expect(store.contract.events[0].y).toBe(6)
  })
})
