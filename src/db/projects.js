import { openDB } from 'idb'

const DB_NAME = 'sceditor-db'
const DB_VERSION = 1
const STORE_NAME = 'projects'

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })
}

export async function listProjects() {
  const db = await getDb()
  return db.getAll(STORE_NAME)
}

export async function getProject(id) {
  const db = await getDb()
  return db.get(STORE_NAME, id)
}

export async function putProject(record) {
  const db = await getDb()
  await db.put(STORE_NAME, record)
}

export async function deleteProject(id) {
  const db = await getDb()
  await db.delete(STORE_NAME, id)
}
