import 'fake-indexeddb/auto'
import { beforeEach, describe, it, expect } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { setActivePinia, createPinia } from 'pinia'
import { useProjectsStore } from './projects.js'
import { useContractStorage } from './contract.js'

function stubLocalStorage() {
  const store = {}
  global.localStorage = {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value) },
    removeItem: (key) => { delete store[key] },
    clear: () => { for (const key of Object.keys(store)) delete store[key] },
  }
}

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory()
  stubLocalStorage()
  setActivePinia(createPinia())
})

describe('createProject', () => {
  it('creates a schema-v2 contract, persists it, and sets it active', async () => {
    const projectsStore = useProjectsStore()
    const contractStore = useContractStorage()
    await projectsStore.createProject('My Contract')
    expect(contractStore.contract.name).toBe('My Contract')
    expect(contractStore.contract.schemaVersion).toBe(2)
    expect(projectsStore.activeProjectId).not.toBeNull()
    await projectsStore.loadProjectList()
    expect(projectsStore.projects).toHaveLength(1)
    expect(projectsStore.projects[0].name).toBe('My Contract')
  })
})

describe('openProject', () => {
  it('loads a stored project into the contract store and resets history', async () => {
    const projectsStore = useProjectsStore()
    const contractStore = useContractStorage()
    await projectsStore.createProject('Project A')
    const idA = projectsStore.activeProjectId
    await projectsStore.createProject('Project B')

    await projectsStore.openProject(idA)
    expect(contractStore.contract.name).toBe('Project A')
    expect(projectsStore.activeProjectId).toBe(idA)
    expect(contractStore.historyIndex).toBeGreaterThanOrEqual(0)
  })

  it('does nothing for an unknown id', async () => {
    const projectsStore = useProjectsStore()
    const contractStore = useContractStorage()
    await projectsStore.createProject('Project A')
    const before = contractStore.contract.name
    await projectsStore.openProject('does-not-exist')
    expect(contractStore.contract.name).toBe(before)
  })
})

describe('renameProject', () => {
  it('renames a project and, if active, updates the live contract name', async () => {
    const projectsStore = useProjectsStore()
    const contractStore = useContractStorage()
    await projectsStore.createProject('Old Name')
    const id = projectsStore.activeProjectId
    await projectsStore.renameProject(id, 'New Name')
    expect(contractStore.contract.name).toBe('New Name')
    await projectsStore.loadProjectList()
    expect(projectsStore.projects.find(p => p.id === id).name).toBe('New Name')
  })

  it('ignores a blank name', async () => {
    const projectsStore = useProjectsStore()
    await projectsStore.createProject('Keep Me')
    const id = projectsStore.activeProjectId
    await projectsStore.renameProject(id, '   ')
    await projectsStore.loadProjectList()
    expect(projectsStore.projects.find(p => p.id === id).name).toBe('Keep Me')
  })

  it('keeps a non-active project\'s stored contract name in sync with the rename', async () => {
    const projectsStore = useProjectsStore()
    const contractStore = useContractStorage()
    await projectsStore.createProject('Project A')
    const idA = projectsStore.activeProjectId
    await projectsStore.createProject('Project B') // now B is active, A is not

    await projectsStore.renameProject(idA, 'Project A Renamed')

    await projectsStore.openProject(idA)
    expect(contractStore.contract.name).toBe('Project A Renamed')
  })
})

describe('switching projects flushes pending edits', () => {
  it('does not lose an unsaved edit when switching to another project and back', async () => {
    const projectsStore = useProjectsStore()
    const contractStore = useContractStorage()
    await projectsStore.createProject('Project A')
    const idA = projectsStore.activeProjectId

    // Simulate an edit that hasn't been explicitly autosaved yet (the debounce window)
    contractStore.contract.variables.push({ id: 'v1', name: 'unsaved_var' })

    await projectsStore.createProject('Project B')
    await projectsStore.openProject(idA)

    expect(contractStore.contract.variables).toHaveLength(1)
    expect(contractStore.contract.variables[0].name).toBe('unsaved_var')
  })
})

describe('deleteProject', () => {
  it('deletes a non-active project without touching the live contract', async () => {
    const projectsStore = useProjectsStore()
    const contractStore = useContractStorage()
    await projectsStore.createProject('Project A')
    const idA = projectsStore.activeProjectId
    await projectsStore.createProject('Project B')

    const originalConfirm = globalThis.confirm
    globalThis.confirm = () => true
    await projectsStore.deleteProject(idA)
    globalThis.confirm = originalConfirm

    expect(contractStore.contract.name).toBe('Project B')
    await projectsStore.loadProjectList()
    expect(projectsStore.projects).toHaveLength(1)
  })

  it('clears the live contract when deleting the active project', async () => {
    const projectsStore = useProjectsStore()
    const contractStore = useContractStorage()
    await projectsStore.createProject('Only Project')
    const id = projectsStore.activeProjectId

    const originalConfirm = globalThis.confirm
    globalThis.confirm = () => true
    await projectsStore.deleteProject(id)
    globalThis.confirm = originalConfirm

    expect(contractStore.contract).toEqual({})
    expect(projectsStore.activeProjectId).toBeNull()
  })

  it('does nothing if the user cancels the confirmation', async () => {
    const projectsStore = useProjectsStore()
    await projectsStore.createProject('Keep Me')
    const id = projectsStore.activeProjectId

    const originalConfirm = globalThis.confirm
    globalThis.confirm = () => false
    await projectsStore.deleteProject(id)
    globalThis.confirm = originalConfirm

    await projectsStore.loadProjectList()
    expect(projectsStore.projects).toHaveLength(1)
  })
})

describe('duplicateProject', () => {
  it('creates a copy without switching the active project', async () => {
    const projectsStore = useProjectsStore()
    const contractStore = useContractStorage()
    await projectsStore.createProject('Original')
    const originalId = projectsStore.activeProjectId

    await projectsStore.duplicateProject(originalId)

    expect(projectsStore.activeProjectId).toBe(originalId)
    expect(contractStore.contract.name).toBe('Original')
    await projectsStore.loadProjectList()
    expect(projectsStore.projects).toHaveLength(2)
    expect(projectsStore.projects.some(p => p.name === 'Original (copy)')).toBe(true)
  })
})

describe('createProjectFromContract', () => {
  it('persists an imported contract as a new active project', async () => {
    const projectsStore = useProjectsStore()
    const contractStore = useContractStorage()
    const imported = { schemaVersion: 2, name: 'Imported', variables: [], structs: [], functions: [], enums: [], guards: [], errorDeclarations: [], events: [], _constructor: null }
    await projectsStore.createProjectFromContract(imported)
    expect(contractStore.contract.name).toBe('Imported')
    expect(projectsStore.activeProjectId).not.toBeNull()
    await projectsStore.loadProjectList()
    expect(projectsStore.projects).toHaveLength(1)
  })

  it('falls back to a default name when the contract has none', async () => {
    const projectsStore = useProjectsStore()
    await projectsStore.createProjectFromContract({ schemaVersion: 2 })
    await projectsStore.loadProjectList()
    expect(projectsStore.projects[0].name).toBe('Imported Contract')
  })
})

describe('migrateLegacyLocalStorage', () => {
  it('migrates an old-shape saved_contract into a new project and clears the legacy keys', async () => {
    const projectsStore = useProjectsStore()
    const contractStore = useContractStorage()
    localStorage.setItem('saved_contract', JSON.stringify({ name: 'Legacy Project', variables: [] }))
    localStorage.setItem('saved_contract_time', '123')

    await projectsStore.migrateLegacyLocalStorage()

    expect(localStorage.getItem('saved_contract')).toBeNull()
    expect(localStorage.getItem('saved_contract_time')).toBeNull()
    expect(contractStore.contract.name).toBe('Legacy Project')
    await projectsStore.loadProjectList()
    expect(projectsStore.projects).toHaveLength(1)
    expect(projectsStore.projects[0].name).toBe('Legacy Project')
  })

  it('does nothing when there is no legacy key', async () => {
    const projectsStore = useProjectsStore()
    await projectsStore.migrateLegacyLocalStorage()
    await projectsStore.loadProjectList()
    expect(projectsStore.projects).toHaveLength(0)
  })

  it('clears a corrupt legacy key without crashing', async () => {
    const projectsStore = useProjectsStore()
    localStorage.setItem('saved_contract', '{not valid json')
    await projectsStore.migrateLegacyLocalStorage()
    expect(localStorage.getItem('saved_contract')).toBeNull()
    await projectsStore.loadProjectList()
    expect(projectsStore.projects).toHaveLength(0)
  })
})

describe('saveActiveProject', () => {
  it('persists the current contract state and bumps updatedAt', async () => {
    const projectsStore = useProjectsStore()
    const contractStore = useContractStorage()
    await projectsStore.createProject('Autosave Test')
    const id = projectsStore.activeProjectId

    contractStore.contract.variables.push({ id: 'v1', name: 'x' })
    await projectsStore.saveActiveProject()

    await projectsStore.openProject(id)
    expect(contractStore.contract.variables).toHaveLength(1)
  })

  it('does nothing when no project is active', async () => {
    const projectsStore = useProjectsStore()
    await expect(projectsStore.saveActiveProject()).resolves.not.toThrow()
  })
})
