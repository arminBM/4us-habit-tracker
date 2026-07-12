<template>
  <div class="min-h-screen bg-[#0B0C10] text-[#E6E8EB]">
    <header class="sticky top-0 z-30 border-b border-white/10 bg-[#0B0C10]/90 backdrop-blur-xl">
      <div class="flex items-center justify-between px-4 py-4">
        <button
  @click="$router.back()"
  class="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-[#9CA3AF] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-[0.95]"
>
  <span class="h-5 w-5">
    <IconBack />
  </span>
</button>

        <h2 class="text-base font-semibold">Finance History</h2>

        <div class="w-[50px]" />
      </div>
    </header>

    <main class="space-y-4 px-4 py-4">
      <div class="flex items-center justify-between">
  <!-- Previous -->
  <button
    @click="financeStore.goToPreviousMonth()"
    class="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-[#9CA3AF] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-[0.95]"
  >
    <span class="h-5 w-5">
      <IconPrevious />
    </span>
  </button>

  <!-- Month -->
  <p class="text-sm font-semibold text-white">
    {{ financeStore.selectedMonthLabel }}
  </p>

  <!-- Next -->
  <button
    @click="financeStore.goToNextMonth()"
    :disabled="financeStore.isCurrentMonth"
    class="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-[#9CA3AF] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-[0.95] disabled:opacity-40 disabled:active:scale-100"
  >
    <span class="h-5 w-5">
      <IconNext />
    </span>
  </button>
</div>

      <section class="space-y-3">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search notes or categories..."
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-primary outline-none placeholder:text-[#7C8591]"
        />

        <div class="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            @click="selectedType = 'all'"
            :class="chipClass(selectedType === 'all')"
          >
            All
          </button>

          <button
            @click="selectedType = 'expense'"
            :class="chipClass(selectedType === 'expense')"
          >
            Expense
          </button>

          <button
            @click="selectedType = 'income'"
            :class="chipClass(selectedType === 'income')"
          >
            Income
          </button>
        </div>

        <div class="flex gap-2">
          <button
            @click="sortOrder = 'newest'"
            :class="chipClass(sortOrder === 'newest')"
          >
            Newest
          </button>

          <button
            @click="sortOrder = 'oldest'"
            :class="chipClass(sortOrder === 'oldest')"
          >
            Oldest
          </button>
        </div>
      </section>

      <div v-if="filteredEntries.length" class="space-y-3">
        <div
          v-for="entry in filteredEntries"
          :key="entry.id"
          class="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <p
                  class="text-base font-semibold"
                  :class="(entry.entryKind || 'expense') === 'income' ? 'text-emerald-400' : 'text-primary'"
                >
                  {{ (entry.entryKind || 'expense') === 'income' ? '+' : '-' }}{{ formatAmount(entry.value) }}
                </p>

                <span class="rounded-full bg-white/10 px-2 py-1 text-xs text-secondary">
                  {{ (entry.entryKind || 'expense') === 'income' ? 'Income' : 'Expense' }}
                </span>
              </div>

              <p class="mt-2 text-sm text-[#9CA3AF]">
                {{ entry.category || 'Uncategorized' }}
              </p>

              <p class="mt-1 text-xs text-[#7C8591]">
                {{ entry.date }}
              </p>

              <p v-if="entry.note" class="mt-2 text-sm text-[#9CA3AF]">
                {{ entry.note }}
              </p>
            </div>

           <button
  @click="handleDelete(entry.id)"
  class="shrink-0 flex items-center justify-center rounded-xl bg-red-500/10 p-2 text-red-400 transition-all duration-200 hover:bg-red-500/20 active:scale-[0.95]"
>
  <span class="h-4 w-4">
    <IconDelete />
  </span>
</button>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex h-40 items-center justify-center text-[#7C8591]"
      >
        No entries yet
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { useMonthlyEntries } from '../composables/useMonthlyEntries'
import IconDelete from '../components/icons/IconDelete.vue'
import IconNext from '../components/icons/IconNext.vue'
import IconPrevious from '../components/icons/IconPrevious.vue'
import IconBack from '../components/icons/IconBack.vue'

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()
const { monthEntries: monthFinanceEntries } = useMonthlyEntries('Finance')

const searchQuery = ref('')
const selectedType = ref('all')
const sortOrder = ref('newest')

function chipClass(active) {
  return [
    'whitespace-nowrap rounded-xl px-3 py-2 text-xs transition',
    active
      ? 'bg-white/10 text-[#E6E8EB]'
      : 'text-[#9CA3AF] hover:bg-white/5',
  ]
}

function formatAmount(value) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

const filteredEntries = computed(() => {
  let items = [...monthFinanceEntries.value]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(entry => {
      const note = (entry.note || '').toLowerCase()
      const category = (entry.category || '').toLowerCase()
      return note.includes(q) || category.includes(q)
    })
  }

  if (selectedType.value !== 'all') {
    items = items.filter(
      entry => (entry.entryKind || 'expense') === selectedType.value
    )
  }

  items.sort((a, b) => {
    const aTime = new Date(a.createdAt || a.date).getTime()
    const bTime = new Date(b.createdAt || b.date).getTime()

    return sortOrder.value === 'newest'
      ? bTime - aTime
      : aTime - bTime
  })

  return items
})

function handleDelete(id) {
  if (!confirm('Delete this entry?')) return
  entriesStore.deleteEntry(id)
}
</script>