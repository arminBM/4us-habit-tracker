import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getAllEntriesFromDb,
  saveEntryToDb,
  deleteEntryFromDb,
  clearAllEntriesFromDb,
} from '../services/db'
import { parseLocalDate } from '../utils/date'
import { normalizeEntries } from '../utils/migrations'

function compareEntriesByDateDesc(a, b) {
  const dateCompare = parseLocalDate(b.date) - parseLocalDate(a.date)

  if (dateCompare !== 0) return dateCompare

  const createdAtA = a.createdAt ? new Date(a.createdAt).getTime() : 0
  const createdAtB = b.createdAt ? new Date(b.createdAt).getTime() : 0

  return createdAtB - createdAtA
}

export const useEntriesStore = defineStore('entries', () => {
  const entries = ref([])
  const loaded = ref(false)

  async function loadEntries() {
    const dbEntries = await getAllEntriesFromDb()
    entries.value = normalizeEntries(dbEntries).sort(compareEntriesByDateDesc)
    loaded.value = true
  }

  async function addEntry(entry) {
    const rawEntry = {
      id: crypto.randomUUID(),
      ...entry,
      createdAt: new Date().toISOString(),
    }

    const [newEntry] = normalizeEntries([rawEntry])
    if (!newEntry) return

    await saveEntryToDb(newEntry)
    entries.value.unshift(newEntry)
    entries.value.sort(compareEntriesByDateDesc)
  }

  async function deleteEntry(id) {
    await deleteEntryFromDb(id)
    entries.value = entries.value.filter(entry => entry.id !== id)
  }

  async function replaceAllEntries(newEntries) {
    const normalizedEntries = normalizeEntries(newEntries)

    await clearAllEntriesFromDb()

    for (const entry of normalizedEntries) {
      await saveEntryToDb(entry)
    }

    entries.value = [...normalizedEntries].sort(compareEntriesByDateDesc)
  }

  async function updateEntry(id, updatedData) {
  const index = entries.value.findIndex(entry => entry.id === id)
  if (index === -1) return

  const existing = entries.value[index]

  const updatedRaw = {
      updatedAt: new Date().toISOString(), // optional but clean
    ...existing,
    ...updatedData,
  }

  const [normalized] = normalizeEntries([updatedRaw])
  if (!normalized) return

  await saveEntryToDb(normalized)

  entries.value[index] = normalized
  entries.value.sort(compareEntriesByDateDesc)
}

  return {
    entries,
    loaded,
    loadEntries,
    addEntry,
    deleteEntry,
    replaceAllEntries,
    updateEntry,
  }
})