import { computed, unref } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { parseLocalDate } from '../utils/date'

export function useMonthlyEntries(type) {
  const entriesStore = useEntriesStore()
  const financeStore = useFinanceStore()

  const entryType = computed(() => unref(type))

  const typedEntries = computed(() =>
    entriesStore.entries.filter(entry => entry.type === entryType.value)
  )

  const monthEntries = computed(() =>
    typedEntries.value.filter(entry => {
      const entryDate = parseLocalDate(entry.date)

      return (
        entryDate.getFullYear() === financeStore.selectedYear &&
        entryDate.getMonth() === financeStore.selectedMonth
      )
    })
  )

  return {
    typedEntries,
    monthEntries,
  }
}