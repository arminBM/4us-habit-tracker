export const DATA_SCHEMA_VERSION = 1

function isValidDateKey(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function toNumberOrDefault(value, fallback = 0) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

function toStringOrDefault(value, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function normalizeFinanceEntry(entry) {
  return {
    ...entry,
    type: 'Finance',
    category: toStringOrDefault(entry.category, 'Other'),
    value: toNumberOrDefault(entry.value, 0),
    entryKind: entry.entryKind === 'income' ? 'income' : 'expense',
    note: toStringOrDefault(entry.note, ''),
  }
}

function normalizeSleepEntry(entry) {
  return {
    ...entry,
    type: 'Sleep',
    category: toStringOrDefault(entry.category, 'Main Sleep'),
    sleepStart: toStringOrDefault(entry.sleepStart, ''),
    sleepEnd: toStringOrDefault(entry.sleepEnd, ''),
    durationMinutes: toNumberOrDefault(entry.durationMinutes, 0),
    sleepQuality: toNumberOrDefault(entry.sleepQuality, 3),
    note: toStringOrDefault(entry.note, ''),
  }
}

function normalizeWorkoutEntry(entry) {
  return {
    ...entry,
    type: 'Workout',
    category: toStringOrDefault(entry.category, 'Other'),
    durationMinutes: toNumberOrDefault(entry.durationMinutes, 0),
    intensity: toNumberOrDefault(entry.intensity, 3),
    note: toStringOrDefault(entry.note, ''),
  }
}

function normalizeStudyEntry(entry) {
  return {
    ...entry,
    type: 'Study',
    category: toStringOrDefault(entry.category, 'Other'),
    subject: toStringOrDefault(entry.subject, ''),
    durationMinutes: toNumberOrDefault(entry.durationMinutes, 0),
    focusLevel: toNumberOrDefault(entry.focusLevel, 3),
    note: toStringOrDefault(entry.note, ''),
  }
}

function normalizeFinanceBudgets(financeBudgets) {
  if (!financeBudgets || typeof financeBudgets !== 'object') {
    return {}
  }

  return {
    dailyBudget: toNumberOrDefault(financeBudgets.dailyBudget, 0),
    weeklyBudget: toNumberOrDefault(financeBudgets.weeklyBudget, 0),
    monthlyBudget: toNumberOrDefault(financeBudgets.monthlyBudget, 0),

    plannerMonthlyIncome: toNumberOrDefault(financeBudgets.plannerMonthlyIncome, 0),
    plannerRent: toNumberOrDefault(financeBudgets.plannerRent, 0),
    plannerBills: toNumberOrDefault(financeBudgets.plannerBills, 0),
    plannerTransport: toNumberOrDefault(financeBudgets.plannerTransport, 0),
    plannerGroceries: toNumberOrDefault(financeBudgets.plannerGroceries, 0),
    plannerDebt: toNumberOrDefault(financeBudgets.plannerDebt, 0),
    plannerOther: toNumberOrDefault(financeBudgets.plannerOther, 0),

    plannerGoalMode:
      financeBudgets.plannerGoalMode === 'percent' ? 'percent' : 'amount',

    plannerGoalValue: toNumberOrDefault(financeBudgets.plannerGoalValue, 200),

    plannerStyleMode: ['conservative', 'balanced', 'flexible'].includes(
      financeBudgets.plannerStyleMode
    )
      ? financeBudgets.plannerStyleMode
      : 'balanced',
  }
}

export function normalizeEntry(rawEntry) {
  if (!rawEntry || typeof rawEntry !== 'object') return null
  if (!rawEntry.id || !rawEntry.type || !isValidDateKey(rawEntry.date)) return null

  const base = {
    ...rawEntry,
    id: String(rawEntry.id),
    date: rawEntry.date,
    createdAt:
      typeof rawEntry.createdAt === 'string'
        ? rawEntry.createdAt
        : new Date().toISOString(),
  }

  switch (rawEntry.type) {
    case 'Finance':
      return normalizeFinanceEntry(base)
    case 'Sleep':
      return normalizeSleepEntry(base)
    case 'Workout':
      return normalizeWorkoutEntry(base)
    case 'Study':
      return normalizeStudyEntry(base)
    default:
      return null
  }
}

export function normalizeEntries(entries) {
  if (!Array.isArray(entries)) return []

  return entries
    .map(normalizeEntry)
    .filter(Boolean)
}

export function migrateBackupData(data) {
  // Old format: raw array of entries
  if (Array.isArray(data)) {
    return {
      version: 0,
      exportedAt: null,
      entries: normalizeEntries(data),
      financeBudgets: {},
    }
  }

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid backup structure')
  }

  const version = Number.isFinite(Number(data.version))
    ? Number(data.version)
    : 0

  return {
    version,
    exportedAt:
      typeof data.exportedAt === 'string' ? data.exportedAt : null,
    entries: normalizeEntries(data.entries),
    financeBudgets: normalizeFinanceBudgets(data.financeBudgets),
  }
}

export function buildExportPayload({ entries, financeBudgets }) {
  return {
    version: DATA_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    entries: normalizeEntries(entries),
    financeBudgets: normalizeFinanceBudgets(financeBudgets),
  }
}