import { buildExportPayload, migrateBackupData } from '../utils/migrations'

export function exportData(payload) {
  const safePayload = buildExportPayload(payload)
  const dataStr = JSON.stringify(safePayload, null, 2)

  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `life-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()

  URL.revokeObjectURL(url)
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const rawData = JSON.parse(event.target.result)
        const migrated = migrateBackupData(rawData)
        resolve(migrated)
      } catch (err) {
        reject('Invalid file format')
      }
    }

    reader.readAsText(file)
  })
}