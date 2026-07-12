<template>
  <div class="min-h-screen bg-[#0B0C10] text-[#E6E8EB]">

    <!-- Header -->
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

        <h2 class="text-base font-semibold">Sleep History</h2>

        <div class="w-[50px]" />
      </div>
    </header>

    <!-- Content -->
    <main class="px-4 py-4 space-y-4">

      <!-- Month selector -->
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

  <!-- Search -->
  <input
    v-model="searchQuery"
    type="text"
    placeholder="Search notes..."
    class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-primary outline-none placeholder:text-[#7C8591]"
  />

  <!-- Quality chips -->
  <div class="flex gap-2 overflow-x-auto no-scrollbar">
    <button
      @click="selectedQuality = 'all'"
      :class="chipClass(selectedQuality === 'all')"
    >
      All
    </button>

    <button
      v-for="q in 5"
      :key="q"
      @click="selectedQuality = String(q)"
      :class="chipClass(selectedQuality === String(q))"
    >
      {{ q }}
    </button>
  </div>

  <!-- Sort toggle -->
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

      <!-- Entries -->
      <div v-if="filteredEntries.length" class="space-y-3">

        <div
          v-for="entry in filteredEntries"
          :key="entry.id"
          class="rounded-2xl border border-white/10 bg-white/5 p-4"
        >
          <div class="flex justify-between items-start gap-4">

            <!-- Info -->
            <div class="flex-1">
              <p class="text-base font-semibold">
                {{ formatDuration(entry.durationMinutes) }}
              </p>

              <p class="text-sm text-[#9CA3AF] mt-1">
                {{ formatSleepRange(entry.sleepStart, entry.sleepEnd) }}
              </p>

              <p class="text-xs text-[#7C8591] mt-1">
                {{ entry.date }}
              </p>

              <p v-if="entry.note" class="text-sm mt-2 text-[#9CA3AF]">
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

      

      <!-- Empty -->
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
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { useMonthlyEntries } from '../composables/useMonthlyEntries'
import { ref, computed } from 'vue'
import IconDelete from '../components/icons/IconDelete.vue'
import IconNext from '../components/icons/IconNext.vue'
import IconPrevious from '../components/icons/IconPrevious.vue'
import IconBack from '../components/icons/IconBack.vue'

function chipClass(active) {
  return [
    'px-3 py-2 rounded-xl text-xs transition whitespace-nowrap',
    active
      ? 'bg-white/10 text-[#E6E8EB]'
      : 'text-[#9CA3AF] hover:bg-white/5'
  ]
}

const searchQuery = ref('')
const selectedQuality = ref('all')
const sortOrder = ref('newest')

const filteredEntries = computed(() => {
  let items = [...monthSleepEntries.value]

  // 🔍 search (notes only)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    items = items.filter(entry =>
      (entry.note || '').toLowerCase().includes(q)
    )
  }

  // 🎯 quality filter
  if (selectedQuality.value !== 'all') {
    items = items.filter(
      entry => String(entry.sleepQuality) === selectedQuality.value
    )
  }

  // ↕️ sorting
  items.sort((a, b) => {
    const aTime = new Date(a.createdAt || a.date).getTime()
    const bTime = new Date(b.createdAt || b.date).getTime()

    return sortOrder.value === 'newest'
      ? bTime - aTime
      : aTime - bTime
  })

  return items
})


const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()
const { monthEntries: monthSleepEntries } = useMonthlyEntries('Sleep')


/* ===== EDIT ===== */


/* ===== DELETE ===== */
function handleDelete(id) {
  if (!confirm('Delete this entry?')) return
  entriesStore.deleteEntry(id)
}

/* ===== FORMAT ===== */
function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

function formatSleepDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function formatSleepRange(start, end) {
  return `${formatSleepDateTime(start)} → ${formatSleepDateTime(end)}`
}
</script>