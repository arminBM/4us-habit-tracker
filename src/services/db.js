import { openDB } from 'idb'

const DB_NAME = 'life-tracker-db'
const STORE_NAME = 'entries'
const DB_VERSION = 1

export async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })
}

export async function getAllEntriesFromDb() {
  const db = await getDb()
  return db.getAll(STORE_NAME)
}

export async function saveEntryToDb(entry) {
  const db = await getDb()
  return db.put(STORE_NAME, entry)
}

export async function deleteEntryFromDb(id) {
  const db = await getDb()
  return db.delete(STORE_NAME, id)
}

export async function clearAllEntriesFromDb() {
  const db = await getDb()
  return db.clear(STORE_NAME)
}