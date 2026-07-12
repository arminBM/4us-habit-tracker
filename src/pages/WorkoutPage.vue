<template>
  <div class="space-y-5 pb-10 sm:space-y-6">
    <section>
      <h2 class="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
        Workout
      </h2>
      <p class="mt-1 text-sm text-secondary">
        Track your workout time, intensity, and consistency.
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
        <p class="mt-2 text-xl metric-value sm:text-2xl">
          {{ todayWorkout }}
        </p>
      </div>

      <div class="card-soft rounded-3xl p-4">
        <p class="metric-label">Month</p>
        <p class="mt-2 text-xl metric-value sm:text-2xl">
          {{ monthWorkout }}
        </p>
      </div>

      <div class="card-soft rounded-3xl p-4">
        <p class="metric-label">Avg Workout</p>
        <p class="mt-2 text-xl metric-value sm:text-2xl">
          {{ avgWorkout }}
        </p>
      </div>

      <div class="card-soft rounded-3xl p-4">
        <p class="metric-label">Longest</p>
        <p class="mt-2 text-xl metric-value sm:text-2xl">
          {{ longestWorkout }}
        </p>
      </div>
    </section>

    <section class="card">
      <p class="metric-label">Workout Summary</p>
      <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <p class="text-secondary">
          Avg intensity:
          <span class="font-medium text-primary">{{ avgIntensity }}</span>
        </p>
        <p class="text-secondary">
          Sessions:
          <span class="font-medium text-primary">{{ sessionsLogged }}</span>
        </p>
      </div>
    </section>

    <section class="card p-4">
  <div class="mb-3 flex items-center justify-between">
    <p class="text-sm text-secondary">Workout Trend</p>

    <div class="flex gap-2">
      <button
        v-for="range in ranges"
        :key="range"
        @click="selectedRange = range"
        :class="[
          'rounded-lg px-3 py-1.5 text-xs transition',
          selectedRange === range
            ? 'bg-white/10 text-primary'
            : 'text-secondary'
        ]"
      >
        {{ range }}D
      </button>
    </div>
  </div>

  <WorkoutOverviewChart :days="selectedRange" />
</section>

    <section class="flex justify-center">
  <router-link
    to="/workout/insights"
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
          <p class="panel-subtitle">Your latest workout logs</p>
        </div>

         <router-link
  to="/workout/history"
  class="shrink-0 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#9CA3AF] transition duration-200 hover:bg-white/10 hover:text-white active:scale-[0.97]"
>
  <span class="h-4 w-4">
    <IconHistory/>
  </span>
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
                {{ entry.category }}
              </p>

              <span class="rounded-full bg-white/10 px-2 py-1 text-xs text-secondary">
                {{ formatDuration(entry.durationMinutes) }}
              </span>

              <span class="rounded-full bg-white/10 px-2 py-1 text-xs text-secondary">
                Intensity: {{ formatIntensity(entry.intensity) }}
              </span>
            </div>

            <p class="mt-2 text-xs text-secondary">
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
        No workout entries yet
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { getLocalDateKey } from '../utils/date'
import { useMonthlyEntries } from '../composables/useMonthlyEntries'
import WorkoutOverviewChart from '../components/WorkoutOverviewChart.vue'
import IconHistory from '../components/icons/IconHistory.vue'
import IconInsights from '../components/icons/IconInsights.vue'
import IconNext from '../components/icons/IconNext.vue'
import IconPrevious from '../components/icons/IconPrevious.vue'
import IconDelete from '../components/icons/IconDelete.vue'

const selectedRange = ref(7)
const ranges = [7, 14, 21]

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

function formatDuration(minutes) {
  const safeMinutes = Number(minutes) || 0
  const h = Math.floor(safeMinutes / 60)
  const m = safeMinutes % 60
  return `${h}h ${m}m`
}

function formatIntensity(value) {
  const intensity = Number(value)
  if (!Number.isFinite(intensity)) return '—'
  return `${intensity}/5`
}

const { typedEntries: workoutEntries, monthEntries: monthWorkoutEntries } =
  useMonthlyEntries('Workout')

const todayWorkoutMinutes = computed(() => {
  const todayKey = getLocalDateKey()

  return workoutEntries.value.reduce((sum, entry) => {
    return entry.date === todayKey
      ? sum + Number(entry.durationMinutes || 0)
      : sum
  }, 0)
})

const monthWorkoutMinutes = computed(() => {
  return monthWorkoutEntries.value.reduce((sum, entry) => {
    return sum + Number(entry.durationMinutes || 0)
  }, 0)
})

const avgWorkoutMinutes = computed(() => {
  if (!monthWorkoutEntries.value.length) return 0

  const total = monthWorkoutEntries.value.reduce((sum, entry) => {
    return sum + Number(entry.durationMinutes || 0)
  }, 0)

  return Math.round(total / monthWorkoutEntries.value.length)
})

const avgIntensity = computed(() => {
  if (!monthWorkoutEntries.value.length) return '—'

  const validEntries = monthWorkoutEntries.value.filter(entry =>
    Number.isFinite(Number(entry.intensity))
  )

  if (!validEntries.length) return '—'

  const total = validEntries.reduce((sum, entry) => {
    return sum + Number(entry.intensity)
  }, 0)

  return `${(total / validEntries.length).toFixed(1)}/5`
})

const longestWorkoutMinutes = computed(() => {
  if (!monthWorkoutEntries.value.length) return 0

  return monthWorkoutEntries.value.reduce((max, entry) => {
    const minutes = Number(entry.durationMinutes || 0)
    return minutes > max ? minutes : max
  }, 0)
})

const sessionsLogged = computed(() => monthWorkoutEntries.value.length)

const visibleEntries = computed(() => monthWorkoutEntries.value.slice(0, 5))

const todayWorkout = computed(() => formatDuration(todayWorkoutMinutes.value))
const monthWorkout = computed(() => formatDuration(monthWorkoutMinutes.value))
const avgWorkout = computed(() => formatDuration(avgWorkoutMinutes.value))
const longestWorkout = computed(() => formatDuration(longestWorkoutMinutes.value))

function handleDelete(id) {
  if (!confirm('Delete this entry?')) return
  entriesStore.deleteEntry(id)
}
</script>