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

        <h2 class="text-base font-semibold">Study History</h2>

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
          placeholder="Search notes, subjects, categories..."
          class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-primary outline-none placeholder:text-[#7C8591]"
        />

        <div class="no-scrollbar flex gap-2 overflow-x-auto">
          <button
            @click="selectedFocus = 'all'"
            :class="chipClass(selectedFocus === 'all')"
          >
            All
          </button>

          <button
            v-for="f in 5"
            :key="f"
            @click="selectedFocus = String(f)"
            :class="chipClass(selectedFocus === String(f))"
          >
            {{ f }}
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
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-base font-semibold">
                  {{ entry.category || 'Study' }}
                </p>

                <span class="rounded-full bg-white/10 px-2 py-1 text-xs text-[#9CA3AF]">
                  {{ formatDuration(entry.durationMinutes) }}
                </span>

                <span class="rounded-full bg-white/10 px-2 py-1 text-xs text-[#9CA3AF]">
                  Focus: {{ formatFocus(entry.focusLevel) }}
                </span>
              </div>

              <p
                v-if="entry.subject"
                class="mt-2 text-sm text-[#9CA3AF]"
              >
                {{ entry.subject }}
              </p>

              <p class="mt-1 text-xs text-[#7C8591]">
                {{ entry.date }}
              </p>

              <p
                v-if="entry.note"
                class="mt-2 text-sm text-[#9CA3AF]"
              >
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
import IconBack from '../components/icons/IconBack.vue'
import IconNext from '../components/icons/IconNext.vue'
import IconPrevious from '../components/icons/IconPrevious.vue'

function chipClass(active) {
  return [
    'px-3 py-2 rounded-xl text-xs transition whitespace-nowrap',
    active
      ? 'bg-white/10 text-[#E6E8EB]'
      : 'text-[#9CA3AF] hover:bg-white/5',
  ]
}

const searchQuery = ref('')
const selectedFocus = ref('all')
const sortOrder = ref('newest')

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()
const { monthEntries: monthStudyEntries } = useMonthlyEntries('Study')

const filteredEntries = computed(() => {
  let items = [...monthStudyEntries.value]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(entry =>
      (entry.note || '').toLowerCase().includes(q) ||
      (entry.subject || '').toLowerCase().includes(q) ||
      (entry.category || '').toLowerCase().includes(q)
    )
  }

  if (selectedFocus.value !== 'all') {
    items = items.filter(
      entry => String(entry.focusLevel) === selectedFocus.value
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

function formatDuration(minutes) {
  const safeMinutes = Number(minutes) || 0
  const h = Math.floor(safeMinutes / 60)
  const m = safeMinutes % 60
  return `${h}h ${m}m`
}

function formatFocus(value) {
  const focus = Number(value)
  if (!Number.isFinite(focus)) return '—'
  return `${focus}/5`
}
</script>