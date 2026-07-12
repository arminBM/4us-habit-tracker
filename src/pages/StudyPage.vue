<template>
  <div class="space-y-5 pb-10 sm:space-y-6">
    <section>
      <h2 class="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
        Study
      </h2>
      <p class="mt-1 text-sm text-secondary">
        Track your study time, focus, and learning patterns.
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
      {{ todayStudy }}
    </p>
  </div>

  <div class="card-soft rounded-3xl p-4">
    <p class="metric-label">Month</p>
    <p class="mt-2 text-xl metric-value sm:text-2xl">
      {{ monthStudy }}
    </p>
  </div>

  <div class="card-soft rounded-3xl p-4">
    <p class="metric-label">Avg Session</p>
    <p class="mt-2 text-xl metric-value sm:text-2xl">
      {{ avgSession }}
    </p>
  </div>

  <div class="card-soft rounded-3xl p-4">
    <p class="metric-label">Longest</p>
    <p class="mt-2 text-xl metric-value sm:text-2xl">
      {{ longestSession }}
    </p>
  </div>
</section>

<section class="card">
  <div class="flex items-start justify-between gap-4">
    <div>
      <p class="metric-label">Planned vs Actual</p>
      <p class="mt-2 text-lg font-semibold text-white sm:text-xl">
        {{ todayStudy }} / {{ formatDuration(dailyStudyTargetMinutes) }}
      </p>
      <p
  class="mt-1 text-sm"
  :class="
    !dailyStudyTargetMinutes
      ? 'text-[#7C8591]'
      : todayStudyMinutes >= dailyStudyTargetMinutes
      ? 'text-emerald-400'
      : 'text-[#9CA3AF]'
  "
>
  {{ todayTargetStatus }}
</p>
    </div>

    <div class="text-right">
      <p class="text-xs text-[#9CA3AF]">Today Target</p>
      <p class="mt-1 text-sm font-semibold text-white">
        {{ formatDuration(dailyStudyTargetMinutes) }}
      </p>
    </div>
  </div>

  <div class="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
  <div
    class="h-full rounded-full transition-all duration-500"
    :class="
      !dailyStudyTargetMinutes
        ? 'bg-white/10'
        : todayStudyMinutes >= dailyStudyTargetMinutes
        ? 'bg-emerald-400'
        : 'bg-blue-400'
    "
    :style="{ width: `${todayTargetProgress}%` }"
  />
</div>

 <div class="mt-4">
  <p class="mb-2 text-xs text-[#7C8591]">Quick target</p>

  <div class="grid grid-cols-5 gap-1 sm:grid-cols-5">
    <button
      v-for="option in quickTargetOptions"
      :key="option.label"
      type="button"
      @click="addDailyStudyTarget(option.minutes)"
      class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#9CA3AF] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-[0.95]"
    >
      +{{ option.label }}
    </button>

    <button
      type="button"
      @click="clearDailyStudyTarget()"
      class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-red-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-200 active:scale-[0.95]"
    >
      Clear
    </button>
  </div>
</div>
</section>

    <section class="card">
      <p class="metric-label">Study Summary</p>
      <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <p class="text-secondary">
          Avg focus:
          <span class="font-medium text-primary">{{ avgFocus }}</span>
        </p>
        <p class="text-secondary">
          Sessions:
          <span class="font-medium text-primary">{{ sessionsLogged }}</span>
        </p>
      </div>
    </section>

    <section class="card">
  <p class="metric-label">Weekly Insight</p>
  <p class="mt-2 text-sm leading-6 text-white">
    {{ smartWeeklyInsight }}
  </p>

  <div class="mt-4 grid grid-cols-3 gap-3">
    <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p class="text-xs text-[#9CA3AF]">This Week</p>
      <p class="mt-1 text-sm font-semibold text-white">
        {{ formatDuration(weeklyStudyMinutes) }}
      </p>
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p class="text-xs text-[#9CA3AF]">Sessions</p>
      <p class="mt-1 text-sm font-semibold text-white">
        {{ weeklySessionCount }}
      </p>
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p class="text-xs text-[#9CA3AF]">Focus</p>
      <p class="mt-1 text-sm font-semibold text-white">
        {{ weeklyFocusNumber ? `${weeklyFocusNumber}/5` : '—' }}
      </p>
    </div>
  </div>
</section>

    <section class="card">
  <p class="metric-label">Insight</p>
  <p class="mt-2 text-sm text-primary">
    {{ smartInsight }}
  </p>
</section>

    <section class="grid grid-cols-3 gap-1 lg:grid-cols-4">
  <div class="card-soft rounded-3xl p-4">
    <p class="metric-label">Streak</p>
    <p class="mt-2 text-xl font-semibold text-orange-400 sm:text-2xl">
      🔥 {{ currentStreak }} days
    </p>
  </div>

 

  <div class="card-soft rounded-3xl p-4">
    <p class="metric-label">Focus Score</p>
    <p class="mt-2 text-xl font-semibold text-purple-400 sm:text-2xl">
      {{ avgFocusNumber }}/5
    </p>
  </div>

  <div class="card-soft rounded-3xl p-4">
    <p class="metric-label">Sessions / Day</p>
    <p class="mt-2 text-xl font-semibold text-primary sm:text-2xl">
      {{ avgSessionPerDay }}
    </p>
  </div>
</section>

    <section class="card p-4">
  <div class="mb-3 flex items-center justify-between">
    <p class="text-sm text-secondary">Study Trend</p>

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

  <StudyOverviewChart :days="selectedRange" />
</section>

     <section class="flex justify-center">
  <router-link
    to="/study/insights"
    class="inline-flex select-none items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-[#9CA3AF] transition-all duration-200 touch-manipulation hover:bg-white/10 hover:text-white active:scale-[0.96] active:bg-white/15 active:text-white"
  >
    <span>View Insights</span>

    <span class="h-4 w-4">
      <IconInsights />
    </span>
  </router-link>
</section>

<section class="card">
  <p class="metric-label">Monthly Growth</p>

  <p class="mt-2 text-sm text-secondary">
    {{ monthStudy }}
  </p>
</section>

    <section class="card">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="panel-title">Recent Entries</h3>
          <p class="panel-subtitle">Your latest study logs</p>
        </div>

         <router-link
  to="/study/history"
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
                Focus: {{ formatFocus(entry.focusLevel) }}
              </span>
            </div>

            <p
              v-if="entry.subject"
              class="mt-2 text-sm text-secondary"
            >
              {{ entry.subject }}
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
        No study entries yet
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { getLocalDateKey } from '../utils/date'
import { useMonthlyEntries } from '../composables/useMonthlyEntries'
import StudyOverviewChart from '../components/StudyOverviewChart.vue'
import IconHistory from '../components/icons/IconHistory.vue'
import IconInsights from '../components/icons/IconInsights.vue'
import IconNext from '../components/icons/IconNext.vue'
import IconPrevious from '../components/icons/IconPrevious.vue'
import IconDelete from '../components/icons/IconDelete.vue'

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

const selectedRange = ref(7)
const ranges = [7, 14, 21]

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

const { typedEntries: studyEntries, monthEntries: monthStudyEntries } =
  useMonthlyEntries('Study')

const todayStudyMinutes = computed(() => {
  const todayKey = getLocalDateKey()

  return studyEntries.value.reduce((sum, entry) => {
    return entry.date === todayKey
      ? sum + Number(entry.durationMinutes || 0)
      : sum
  }, 0)
})

const monthStudyMinutes = computed(() => {
  return monthStudyEntries.value.reduce((sum, entry) => {
    return sum + Number(entry.durationMinutes || 0)
  }, 0)
})

const avgSessionMinutes = computed(() => {
  if (!monthStudyEntries.value.length) return 0

  const total = monthStudyEntries.value.reduce((sum, entry) => {
    return sum + Number(entry.durationMinutes || 0)
  }, 0)

  return Math.round(total / monthStudyEntries.value.length)
})

const avgFocus = computed(() => {
  if (!monthStudyEntries.value.length) return '—'

  const validEntries = monthStudyEntries.value.filter(entry =>
    Number.isFinite(Number(entry.focusLevel))
  )

  if (!validEntries.length) return '—'

  const total = validEntries.reduce((sum, entry) => {
    return sum + Number(entry.focusLevel)
  }, 0)

  return `${(total / validEntries.length).toFixed(1)}/5`
})

const longestSessionMinutes = computed(() => {
  if (!monthStudyEntries.value.length) return 0

  return monthStudyEntries.value.reduce((max, entry) => {
    const minutes = Number(entry.durationMinutes || 0)
    return minutes > max ? minutes : max
  }, 0)
})

const sessionsLogged = computed(() => monthStudyEntries.value.length)

const visibleEntries = computed(() => monthStudyEntries.value.slice(0, 5))

const todayStudy = computed(() => formatDuration(todayStudyMinutes.value))
const monthStudy = computed(() => formatDuration(monthStudyMinutes.value))
const avgSession = computed(() => formatDuration(avgSessionMinutes.value))
const longestSession = computed(() => formatDuration(longestSessionMinutes.value))

function handleDelete(id) {
  if (!confirm('Delete this entry?')) return
  entriesStore.deleteEntry(id)
}

/* -------------------------
   Daily target (persistent + auto-reset)
------------------------- */

const STUDY_TARGET_STORAGE_KEY = 'life-tracker-study-daily-target'

const todayKey = computed(() => getLocalDateKey())

function loadStoredStudyTarget() {
  try {
    const raw = localStorage.getItem(STUDY_TARGET_STORAGE_KEY)
    if (!raw) return 0

    const parsed = JSON.parse(raw)

    if (!parsed || typeof parsed !== 'object') return 0
    if (parsed.date !== getLocalDateKey()) return 0

    const minutes = Number(parsed.minutes || 0)
    return Number.isFinite(minutes) && minutes > 0 ? minutes : 0
  } catch {
    return 0
  }
}

const dailyStudyTargetMinutes = ref(loadStoredStudyTarget())

const quickTargetOptions = [
  { label: '15m', minutes: 15 },
  { label: '30m', minutes: 30 },
  { label: '45m', minutes: 45 },
  { label: '1h', minutes: 60 },
]

function addDailyStudyTarget(minutes) {
  dailyStudyTargetMinutes.value += minutes
}

function clearDailyStudyTarget() {
  dailyStudyTargetMinutes.value = 0
}

watch(
  dailyStudyTargetMinutes,
  (minutes) => {
    try {
      localStorage.setItem(
        STUDY_TARGET_STORAGE_KEY,
        JSON.stringify({
          date: todayKey.value,
          minutes: Number(minutes || 0),
        })
      )
    } catch (error) {
      console.error('Failed to save study daily target', error)
    }
  },
  { immediate: true }
)

watch(
  todayKey,
  (newDate) => {
    try {
      const raw = localStorage.getItem(STUDY_TARGET_STORAGE_KEY)
      if (!raw) {
        dailyStudyTargetMinutes.value = 0
        return
      }

      const parsed = JSON.parse(raw)

      if (!parsed || parsed.date !== newDate) {
        dailyStudyTargetMinutes.value = 0
      }
    } catch {
      dailyStudyTargetMinutes.value = 0
    }
  },
  { immediate: true }
)

const todayTargetProgress = computed(() => {
  if (!dailyStudyTargetMinutes.value) return 0

  return Math.min(
    (todayStudyMinutes.value / dailyStudyTargetMinutes.value) * 100,
    100
  )
})

const remainingTodayTargetMinutes = computed(() => {
  return Math.max(0, dailyStudyTargetMinutes.value - todayStudyMinutes.value)
})

const todayTargetStatus = computed(() => {
  if (!dailyStudyTargetMinutes.value) {
    return 'No target set'
  }

  if (todayStudyMinutes.value >= dailyStudyTargetMinutes.value) {
    return 'Target reached'
  }

  return `${formatDuration(remainingTodayTargetMinutes.value)} left`
})

/* -------------------------
   Streak / focus / sessions
------------------------- */

const studyDatesSet = computed(() => {
  return new Set(studyEntries.value.map(entry => entry.date))
})

const currentStreak = computed(() => {
  let streak = 0
  const today = new Date()

  while (true) {
    const key = getLocalDateKey(today)
    if (!studyDatesSet.value.has(key)) break

    streak++
    today.setDate(today.getDate() - 1)
  }

  return streak
})

const avgFocusNumber = computed(() => {
  if (!monthStudyEntries.value.length) return 0

  const validEntries = monthStudyEntries.value.filter(entry =>
    Number.isFinite(Number(entry.focusLevel))
  )

  if (!validEntries.length) return 0

  const total = validEntries.reduce((sum, entry) => {
    return sum + Number(entry.focusLevel)
  }, 0)

  return Number((total / validEntries.length).toFixed(1))
})

const avgSessionPerDay = computed(() => {
  const days = new Set(monthStudyEntries.value.map(entry => entry.date)).size
  if (!days) return 0
  return (sessionsLogged.value / days).toFixed(1)
})

const smartInsight = computed(() => {
  if (!monthStudyEntries.value.length) {
    return 'Start logging your study to see insights.'
  }

  if (avgFocusNumber.value < 2.5) {
    return 'Your focus is low. Try shorter sessions.'
  }

  if (avgSessionPerDay.value > 3) {
    return 'You study frequently, but sessions are fragmented.'
  }

  if (todayStudyMinutes.value === 0) {
    return 'You broke your streak today. Get back on track.'
  }

  if (currentStreak.value >= 5) {
    return 'Great consistency. Keep the streak going.'
  }

  return 'You are building a steady study habit.'
})

/* -------------------------
   Weekly insight
------------------------- */

const weeklyStudyEntries = computed(() => {
  const now = new Date()
  const start = new Date(now)
  const day = start.getDay()
  const diff = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diff)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return studyEntries.value.filter(entry => {
    const entryDate = new Date(entry.date)
    return entryDate >= start && entryDate <= end
  })
})

const weeklyStudyMinutes = computed(() => {
  return weeklyStudyEntries.value.reduce((sum, entry) => {
    return sum + Number(entry.durationMinutes || 0)
  }, 0)
})

const weeklyFocusNumber = computed(() => {
  const validEntries = weeklyStudyEntries.value.filter(entry =>
    Number.isFinite(Number(entry.focusLevel))
  )

  if (!validEntries.length) return 0

  const total = validEntries.reduce((sum, entry) => {
    return sum + Number(entry.focusLevel)
  }, 0)

  return Number((total / validEntries.length).toFixed(1))
})

const weeklySessionCount = computed(() => weeklyStudyEntries.value.length)

const weeklyCategoryTotals = computed(() => {
  const totals = {}

  for (const entry of weeklyStudyEntries.value) {
    const category = entry.category || 'Other'
    totals[category] = (totals[category] || 0) + Number(entry.durationMinutes || 0)
  }

  return totals
})

const topWeeklyCategory = computed(() => {
  const items = Object.entries(weeklyCategoryTotals.value)
  if (!items.length) return null

  const [category, minutes] = items.sort((a, b) => b[1] - a[1])[0]
  return {
    category,
    minutes,
  }
})

const smartWeeklyInsight = computed(() => {
  if (!weeklyStudyEntries.value.length) {
    return 'No study logged this week yet. Start with one session today.'
  }

  if (weeklyStudyMinutes.value >= 600 && weeklyFocusNumber.value >= 4) {
    return `Strong week. You studied ${formatDuration(weeklyStudyMinutes.value)} with high focus.`
  }

  if (weeklySessionCount.value >= 5 && weeklyFocusNumber.value < 3) {
    return 'You are consistent, but focus is low. Try shorter and more deliberate sessions.'
  }

  if (weeklySessionCount.value <= 2 && weeklyStudyMinutes.value >= 240) {
    return 'You study in long sessions. Consider splitting them to keep focus stronger.'
  }

  if (topWeeklyCategory.value) {
    return `${topWeeklyCategory.value.category} is your main focus this week with ${formatDuration(topWeeklyCategory.value.minutes)} logged.`
  }

  return 'Your study pattern is building steadily this week.'
})
</script>