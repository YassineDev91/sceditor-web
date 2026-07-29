import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import { listProjects, getProject, putProject, deleteProject } from './projects.js'

beforeEach(() => {
  globalThis.indexedDB = new IDBFactory()
})

describe('projects db', () => {
  it('returns an empty list when no projects are stored', async () => {
    const all = await listProjects()
    expect(all).toEqual([])
  })

  it('putProject stores a record retrievable by getProject', async () => {
    const record = { id: 'p1', name: 'Test Project', contract: { name: 'Test Project' }, createdAt: 1, updatedAt: 1 }
    await putProject(record)
    const fetched = await getProject('p1')
    expect(fetched).toEqual(record)
  })

  it('getProject returns undefined for a missing id', async () => {
    const fetched = await getProject('does-not-exist')
    expect(fetched).toBeUndefined()
  })

  it('listProjects returns all stored records', async () => {
    await putProject({ id: 'p1', name: 'A', contract: {}, createdAt: 1, updatedAt: 1 })
    await putProject({ id: 'p2', name: 'B', contract: {}, createdAt: 2, updatedAt: 2 })
    const all = await listProjects()
    expect(all).toHaveLength(2)
    expect(all.map(p => p.id).sort()).toEqual(['p1', 'p2'])
  })

  it('putProject overwrites an existing record with the same id', async () => {
    await putProject({ id: 'p1', name: 'Original', contract: {}, createdAt: 1, updatedAt: 1 })
    await putProject({ id: 'p1', name: 'Renamed', contract: {}, createdAt: 1, updatedAt: 2 })
    const all = await listProjects()
    expect(all).toHaveLength(1)
    expect(all[0].name).toBe('Renamed')
  })

  it('deleteProject removes a record', async () => {
    await putProject({ id: 'p1', name: 'A', contract: {}, createdAt: 1, updatedAt: 1 })
    await deleteProject('p1')
    const all = await listProjects()
    expect(all).toEqual([])
  })

  it('deleteProject on a missing id does not throw', async () => {
    await expect(deleteProject('does-not-exist')).resolves.not.toThrow()
  })
})
