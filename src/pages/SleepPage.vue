<template>
  <div class="space-y-5 pb-10 sm:space-y-6">

    <section>
      <h2 class="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">Sleep</h2>
      <p class="mt-1 text-sm text-secondary">
        Track your sleep duration, quality, and consistency.
      </p>
    </section>

    <section class="card flex items-center justify-between px-4 py-3">
  <!-- Previous -->
  <button
    @click="financeStore.goToPreviousMonth()"
    class="flex items-center justify-center rounded-xl border border-white/10 p-2 text-[#9CA3AF] transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-[0.95] active:bg-white/10"
  >
    <span class="h-5 w-5">
      <IconPrevious />
    </span>
  </button>

  <!-- Center -->
  <div class="text-center">
    <p class="text-xs text-[#9CA3AF]">Month</p>
    <p class="text-sm font-semibold text-white sm:text-base">
      {{ financeStore.selectedMonthLabel }}
    </p>
  </div>

  <!-- Next -->
  <button
    @click="financeStore.goToNextMonth()"
    :disabled="financeStore.isCurrentMonth"
    class="flex items-center justify-center rounded-xl border border-white/10 p-2 text-[#9CA3AF] transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-[0.95] active:bg-white/10 disabled:opacity-40 disabled:active:scale-100"
  >
    <span class="h-5 w-5">
      <IconNext />
    </span>
  </button>
</section>

    <section class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div class="card-soft rounded-3xl p-4">
        <p class="metric-label">Today</p>
        <p class="mt-2 text-xl metric-value sm:text-2xl">{{ todaySleep }}</p>
      </div>

      <div class="card-soft rounded-3xl p-4">
        <p class="metric-label">Month</p>
        <p class="mt-2 text-xl metric-value sm:text-2xl">{{ monthSleep }}</p>
      </div>

      <div class="card-soft rounded-3xl p-4">
        <p class="metric-label">Average</p>
        <p class="mt-2 text-xl metric-value sm:text-2xl">{{ avgSleep }}</p>
      </div>

      <div class="card-soft rounded-3xl p-4">
        <p class="metric-label">Quality</p>
        <p class="mt-2 text-xl metric-value sm:text-2xl">{{ avgQuality }}</p>
      </div>
    </section>

    <section class="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
      <div class="card">
        <p class="metric-label">Sleep Summary</p>
        <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <p class="text-secondary">
            Longest:
            <span class="font-medium text-primary">{{ longestSleep }}</span>
          </p>
          <p class="text-secondary">
            Shortest:
            <span class="font-medium text-primary">{{ shortestSleep }}</span>
          </p>
          <p class="text-secondary">
            Nights:
            <span class="font-medium text-primary">{{ nightsLogged }}</span>
          </p>
        </div>
      </div>

      <div class="card">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="metric-label">Consistency</p>
            <p class="mt-2 text-xl metric-value sm:text-2xl">
              {{ consistencyScore === null ? '—' : consistencyScore }}
            </p>
            <p class="mt-1 text-xs text-secondary">{{ consistencyLabel }}</p>
          </div>

          <div class="space-y-1 text-right text-xs text-secondary">
            <p>Bed: {{ avgBedtimeLabel }}</p>
            <p>Wake: {{ avgWakeLabel }}</p>
            <p>Bed drift: {{ bedtimeDeviationLabel }}</p>
            <p>Wake drift: {{ wakeDeviationLabel }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="card p-4">
  <div class="flex items-center justify-between mb-3">
    <p class="text-sm text-secondary">Sleep Trend</p>

    <div class="flex gap-2">
      <button
        v-for="range in ranges"
        :key="range"
        @click="selectedRange = range"
        :class="[
          'px-3 py-1.5 rounded-lg text-xs',
          selectedRange === range
            ? 'bg-white/10 text-primary'
            : 'text-secondary'
        ]"
      >
        {{ range }}D
      </button>
    </div>
  </div>

  <SleepOverviewChart :days="selectedRange" />
</section>

   <section class="flex justify-center">
  <router-link
    to="/sleep/insights"
    class="inline-flex select-none items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-[#9CA3AF] transition-all duration-200 touch-manipulation hover:bg-white/10 hover:text-white active:scale-[0.96] active:bg-white/15 active:text-white"
  >
    <span>View Insights</span>

    <span class="h-4 w-4">
      <IconInsights />
    </span>
  </router-link>
</section>

<section class="card">
  <div class="flex items-center justify-between gap-3">
    <div>
      <h3 class="panel-title">Recent Entries</h3>
      <p class="panel-subtitle">Your latest sleep logs</p>
    </div>

    <router-link
  to="/sleep/history"
  class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary hover:bg-white/10"
>
    <IconHistory />
</router-link>
  </div>

  <div v-if="visibleEntries.length" class="mt-5 space-y-3">
    <div
      v-for="entry in visibleEntries"
      :key="entry.id"
      class="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
    >
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <p class="text-base font-semibold text-primary">
            {{ formatDuration(entry.durationMinutes) }}
          </p>

          <span class="rounded-full bg-white/10 px-2 py-1 text-xs text-secondary">
            Quality: {{ formatQuality(entry.sleepQuality) }}
          </span>
        </div>

        <p class="mt-2 text-sm text-secondary">
          {{ formatSleepRange(entry.sleepStart, entry.sleepEnd) }}
        </p>

        <p class="mt-1 text-xs text-secondary">
          {{ entry.date }}
        </p>

        <p
          v-if="entry.note"
          class="mt-2 text-sm text-secondary"
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

  <div
    v-else
    class="mt-6 flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-[#7C8591]"
  >
    No sleep entries yet
  </div>
</section>

  </div>
</template>


<script setup>

import { computed, ref } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { getLocalDateKey} from '../utils/date'
import { useMonthlyEntries } from '../composables/useMonthlyEntries'
import SleepOverviewChart from '../components/SleepOverviewChart.vue'
import IconHistory from '../components/icons/IconHistory.vue'
import IconInsights from '../components/icons/IconInsights.vue'
import IconNext from '../components/icons/IconNext.vue'
import IconPrevious from '../components/icons/IconPrevious.vue'
import IconDelete from '../components/icons/IconDelete.vue'

const visibleEntries = computed(() => {
  return monthSleepEntries.value.slice(0, 5)
})

const ranges = [7, 14, 21]
const selectedRange = ref(7)

const selectedWeekIndex = ref(null)

function handleWeekSelect(index) {
  selectedWeekIndex.value =
    selectedWeekIndex.value === index ? null : index
}

function getMinutesFromDateTime(value) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return date.getHours() * 60 + date.getMinutes()
}

function normalizeBedtimeMinutes(value) {
  const minutes = getMinutesFromDateTime(value)
  if (minutes === null) return null

  // Treat after-midnight bedtimes as continuation of late night
  return minutes < 12 * 60 ? minutes + 24 * 60 : minutes
}

function average(numbers) {
  if (!numbers.length) return 0
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length
}

function averageDeviation(numbers, avg) {
  if (!numbers.length) return 0

  const total = numbers.reduce((sum, n) => {
    return sum + Math.abs(n - avg)
  }, 0)

  return total / numbers.length
}

function formatClockMinutes(totalMinutes) {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440
  const hours = Math.floor(normalized / 60)
  const minutes = normalized % 60

  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function getConsistencyLabel(minutes) {
  if (minutes <= 30) return 'Very consistent'
  if (minutes <= 60) return 'Fairly consistent'
  if (minutes <= 90) return 'Inconsistent'
  return 'Very inconsistent'
}

const bedtimeMinutesList = computed(() =>
  monthSleepEntries.value
    .map(entry => normalizeBedtimeMinutes(entry.sleepStart))
    .filter(value => value !== null)
)

const wakeMinutesList = computed(() =>
  monthSleepEntries.value
    .map(entry => getMinutesFromDateTime(entry.sleepEnd))
    .filter(value => value !== null)
)

const avgBedtimeMinutes = computed(() =>
  average(bedtimeMinutesList.value)
)

const avgWakeMinutes = computed(() =>
  average(wakeMinutesList.value)
)

const bedtimeDeviationMinutes = computed(() =>
  averageDeviation(bedtimeMinutesList.value, avgBedtimeMinutes.value)
)

const wakeDeviationMinutes = computed(() =>
  averageDeviation(wakeMinutesList.value, avgWakeMinutes.value)
)

const consistencyScore = computed(() => {
  if (!monthSleepEntries.value.length) return null

  const combinedDeviation =
    (bedtimeDeviationMinutes.value + wakeDeviationMinutes.value) / 2

  const score = Math.max(0, Math.min(100, Math.round(100 - combinedDeviation)))
  return score
})

const avgBedtimeLabel = computed(() => {
  if (!bedtimeMinutesList.value.length) return '—'
  return formatClockMinutes(avgBedtimeMinutes.value)
})

const avgWakeLabel = computed(() => {
  if (!wakeMinutesList.value.length) return '—'
  return formatClockMinutes(avgWakeMinutes.value)
})

const bedtimeDeviationLabel = computed(() => {
  if (!bedtimeMinutesList.value.length) return '—'
  return `${Math.round(bedtimeDeviationMinutes.value)} min`
})

const wakeDeviationLabel = computed(() => {
  if (!wakeMinutesList.value.length) return '—'
  return `${Math.round(wakeDeviationMinutes.value)} min`
})

const consistencyLabel = computed(() => {
  if (consistencyScore.value === null) return '—'

  const combinedDeviation =
    (bedtimeDeviationMinutes.value + wakeDeviationMinutes.value) / 2

  return getConsistencyLabel(combinedDeviation)
})


function formatQuality(value) {
  const quality = Number(value)

  if (!Number.isFinite(quality)) return '—'

  return `${quality}/5`
}

function formatSleepDateTime(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

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

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()



function formatDuration(minutes) {
  const safeMinutes = Number(minutes) || 0

  if (safeMinutes <= 0) return '0h 0m'

  const h = Math.floor(safeMinutes / 60)
  const m = safeMinutes % 60
  return `${h}h ${m}m`
}



const todaySleepMinutes = computed(() => {
  const todayKey = getLocalDateKey()

  return sleepEntries.value.reduce((sum, entry) => {
    return entry.date === todayKey
      ? sum + Number(entry.durationMinutes || 0)
      : sum
  }, 0)
})

const { typedEntries: sleepEntries, monthEntries: monthSleepEntries } =
  useMonthlyEntries('Sleep')

const nightsLogged = computed(() => monthSleepEntries.value.length)

const longestSleepMinutes = computed(() => {
  if (!monthSleepEntries.value.length) return 0

  return monthSleepEntries.value.reduce((max, entry) => {
    const minutes = Number(entry.durationMinutes || 0)
    return minutes > max ? minutes : max
  }, 0)
})

const shortestSleepMinutes = computed(() => {
  if (!monthSleepEntries.value.length) return 0

  return monthSleepEntries.value.reduce((min, entry) => {
    const minutes = Number(entry.durationMinutes || 0)
    return minutes < min ? minutes : min
  }, Number.POSITIVE_INFINITY)
})

const longestSleep = computed(() => formatDuration(longestSleepMinutes.value))
const shortestSleep = computed(() => formatDuration(shortestSleepMinutes.value))

const monthSleepMinutes = computed(() => {
  return monthSleepEntries.value.reduce((sum, entry) => {
    return sum + Number(entry.durationMinutes || 0)
  }, 0)
})

const avgSleepMinutes = computed(() => {
  if (!monthSleepEntries.value.length) return 0

  const total = monthSleepEntries.value.reduce((sum, entry) => {
    return sum + Number(entry.durationMinutes || 0)
  }, 0)

  return Math.round(total / monthSleepEntries.value.length)
})

const avgQuality = computed(() => {
  if (!monthSleepEntries.value.length) return '—'

  const entriesWithQuality = monthSleepEntries.value.filter(entry =>
    Number.isFinite(Number(entry.sleepQuality))
  )

  if (!entriesWithQuality.length) return '—'

  const total = entriesWithQuality.reduce((sum, entry) => {
    return sum + Number(entry.sleepQuality)
  }, 0)

  return (total / entriesWithQuality.length).toFixed(1)
})

const todaySleep = computed(() => formatDuration(todaySleepMinutes.value))
const monthSleep = computed(() => formatDuration(monthSleepMinutes.value))
const avgSleep = computed(() => formatDuration(avgSleepMinutes.value))

function handleDelete(id) {
  if (!confirm('Delete this entry?')) return
  entriesStore.deleteEntry(id)
}
</script>