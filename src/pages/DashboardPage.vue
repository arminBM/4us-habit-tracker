<template>
  <div class="space-y-5 pb-10 sm:space-y-6">
    <section>
      <h2 class="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
        Dashboard
      </h2>
      <p class="mt-1 text-sm text-secondary">
        A soft little space for her day, with the things that matter most.
      </p>
    </section>

    <section class="card overflow-hidden">
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-xs uppercase tracking-[0.22em] text-[#F2C6C2]">
            For you
          </p>
          <p class="mt-3 text-base leading-7 text-white sm:text-lg">
            {{ todayLoveMessage }}
          </p>
        </div>

        <div
          class="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right"
        >
          <p class="text-[11px] uppercase tracking-[0.18em] text-[#9CA3AF]">
            Today
          </p>
          <p class="mt-1 text-sm font-semibold text-white">
            {{ todayLabel }}
          </p>
        </div>
      </div>
    </section>

    <section class="card flex items-center justify-between px-4 py-3">
      <button
        @click="financeStore.goToPreviousMonth()"
        class="flex items-center justify-center rounded-xl border border-white/10 p-2 text-[#9CA3AF] transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-[0.95] active:bg-white/10"
      >
        <span class="h-5 w-5">
          <IconPrevious />
        </span>
      </button>

      <div class="text-center">
        <p class="text-xs text-[#9CA3AF]">Month</p>
        <p class="text-sm font-semibold text-white sm:text-base">
          {{ financeStore.selectedMonthLabel }}
        </p>
      </div>

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

    <section class="card p-2">
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="section in sectionOptions"
          :key="section.value"
          type="button"
          @click="selectedSection = section.value"
          class="rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 active:scale-[0.97]"
          :class="
            selectedSection === section.value
              ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
              : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'
          "
        >
          {{ section.label }}
        </button>
      </div>
    </section>

    <section class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div
        v-for="metric in activeMetrics"
        :key="metric.label"
        class="card-soft rounded-3xl p-4"
      >
        <p class="metric-label">{{ metric.label }}</p>
        <p
          class="mt-2 text-xl font-semibold sm:text-2xl"
          :class="metric.valueClass || 'metric-value'"
        >
          {{ metric.value }}
        </p>
        <p
          v-if="metric.hint"
          class="mt-2 text-xs leading-5 text-[#7C8591]"
        >
          {{ metric.hint }}
        </p>
      </div>
    </section>

    <section class="card">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="metric-label">{{ activeSectionTitle }}</p>
          <p class="mt-2 text-sm leading-6 text-white">
            {{ activeInsight }}
          </p>
        </div>

        <div
          class="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
        >
          <p class="text-[11px] uppercase tracking-[0.18em] text-[#9CA3AF]">
            View
          </p>
          <p class="mt-1 text-sm font-semibold text-white">
            {{ activeSectionLabel }}
          </p>
        </div>
      </div>
    </section>

    <section class="card">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="panel-title">Gentle reminder</h3>
          <p class="panel-subtitle">A little extra warmth for her day</p>
        </div>
      </div>

      <p class="mt-4 text-sm leading-6 text-primary">
        You do not need a perfect day to have a meaningful one. Small progress,
        soft effort, and a calm heart still count.
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useFinanceStore } from '../stores/useFinanceStore'
import { useMonthlyEntries } from '../composables/useMonthlyEntries'
import { getLocalDateKey } from '../utils/date'
import IconNext from '../components/icons/IconNext.vue'
import IconPrevious from '../components/icons/IconPrevious.vue'

const financeStore = useFinanceStore()

const selectedSection = ref('Study')

const sectionOptions = [
  { label: 'Study', value: 'Study' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Workout', value: 'Workout' },
  { label: 'Sleep', value: 'Sleep' },
]

const { typedEntries: studyEntries, monthEntries: monthStudyEntries } =
  useMonthlyEntries('Study')
const { typedEntries: financeEntries, monthEntries: monthFinanceEntries } =
  useMonthlyEntries('Finance')
const { typedEntries: workoutEntries, monthEntries: monthWorkoutEntries } =
  useMonthlyEntries('Workout')
const { typedEntries: sleepEntries, monthEntries: monthSleepEntries } =
  useMonthlyEntries('Sleep')

const todayKey = computed(() => getLocalDateKey())

const loveMessages = [
  'I hope today feels gentle on your heart. No matter what happens, I am always proud of you.',
  'You bring so much softness and light into my life, even in ways you do not notice.',
  'I love the way you keep going, even on quiet days when nobody sees how hard you try.',
  'Whatever today looks like, please remember that you are deeply loved, exactly as you are.',
  'You are my favorite part of every ordinary day, and I hope today gives a little kindness back to you.',
  'I hope you move through today with ease, and I hope you feel my love with you in every small moment.',
  'Even on your tired days, you are still beautiful to me, still enough, and still my favorite person.',
  'I do not need a special reason to love you more, but somehow every day gives me one anyway.',
  'Take today slowly if you need to. You never have to rush to be worthy of love.',
  'No matter how productive today is, your value stays the same, and my love for you stays steady.',
  'I hope something small makes you smile today, and I hope you remember how much you mean to me.',
  'You make life feel softer, warmer, and more worth showing up for.',
]

function getDeterministicIndex(key, length) {
  let hash = 0

  for (let i = 0; i < key.length; i += 1) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash)
  }

  return Math.abs(hash) % length
}

const todayLoveMessage = computed(() => {
  const index = getDeterministicIndex(todayKey.value, loveMessages.length)
  return loveMessages[index]
})

const todayLabel = computed(() => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  }).format(new Date())
})

function formatDuration(minutes) {
  const safeMinutes = Number(minutes) || 0
  const h = Math.floor(safeMinutes / 60)
  const m = safeMinutes % 60
  return `${h}h ${m}m`
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString()
}

function formatSignedNumber(value) {
  const safeValue = Number(value || 0)
  const abs = Math.abs(safeValue).toLocaleString()

  if (safeValue > 0) return `+${abs}`
  if (safeValue < 0) return `-${abs}`
  return '0'
}

function getUniqueDays(entries) {
  return new Set(entries.map(entry => entry.date)).size
}

function getTopCategory(entries) {
  const totals = {}

  for (const entry of entries) {
    const category = entry.category || 'Other'
    const amount =
      Number(entry.durationMinutes || entry.value || 0)

    totals[category] = (totals[category] || 0) + amount
  }

  const items = Object.entries(totals)
  if (!items.length) return '—'

  return items.sort((a, b) => b[1] - a[1])[0][0]
}

const todayStudyMinutes = computed(() => {
  return studyEntries.value.reduce((sum, entry) => {
    return entry.date === todayKey.value
      ? sum + Number(entry.durationMinutes || 0)
      : sum
  }, 0)
})

const monthStudyMinutes = computed(() => {
  return monthStudyEntries.value.reduce((sum, entry) => {
    return sum + Number(entry.durationMinutes || 0)
  }, 0)
})

const studySessionsThisMonth = computed(() => monthStudyEntries.value.length)

const studyDatesSet = computed(() => {
  return new Set(studyEntries.value.map(entry => entry.date))
})

const currentStudyStreak = computed(() => {
  let streak = 0
  const cursor = new Date()

  while (true) {
    const key = getLocalDateKey(cursor)
    if (!studyDatesSet.value.has(key)) break

    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
})

const monthExpense = computed(() => {
  return monthFinanceEntries.value.reduce((sum, entry) => {
    return entry.entryKind === 'expense'
      ? sum + Number(entry.value || 0)
      : sum
  }, 0)
})

const monthIncome = computed(() => {
  return monthFinanceEntries.value.reduce((sum, entry) => {
    return entry.entryKind === 'income'
      ? sum + Number(entry.value || 0)
      : sum
  }, 0)
})

const monthNet = computed(() => monthIncome.value - monthExpense.value)

const financeEntryCount = computed(() => monthFinanceEntries.value.length)

const todayWorkoutMinutes = computed(() => {
  return workoutEntries.value.reduce((sum, entry) => {
    return entry.date === todayKey.value
      ? sum + Number(entry.durationMinutes || 0)
      : sum
  }, 0)
})

const monthWorkoutMinutes = computed(() => {
  return monthWorkoutEntries.value.reduce((sum, entry) => {
    return sum + Number(entry.durationMinutes || 0)
  }, 0)
})

const workoutSessionsThisMonth = computed(() => monthWorkoutEntries.value.length)

const workoutTopCategory = computed(() => getTopCategory(monthWorkoutEntries.value))

const latestSleepEntry = computed(() => sleepEntries.value[0] || null)

const latestSleepDuration = computed(() => {
  if (!latestSleepEntry.value) return '—'
  return formatDuration(latestSleepEntry.value.durationMinutes)
})

const monthSleepAverageMinutes = computed(() => {
  if (!monthSleepEntries.value.length) return 0

  const total = monthSleepEntries.value.reduce((sum, entry) => {
    return sum + Number(entry.durationMinutes || 0)
  }, 0)

  return Math.round(total / monthSleepEntries.value.length)
})

const monthSleepCount = computed(() => monthSleepEntries.value.length)

const monthSleepAverageQuality = computed(() => {
  const validEntries = monthSleepEntries.value.filter(entry =>
    Number.isFinite(Number(entry.sleepQuality))
  )

  if (!validEntries.length) return '—'

  const total = validEntries.reduce((sum, entry) => {
    return sum + Number(entry.sleepQuality)
  }, 0)

  return `${(total / validEntries.length).toFixed(1)}/5`
})

const activeSectionLabel = computed(() => selectedSection.value)

const activeSectionTitle = computed(() => {
  switch (selectedSection.value) {
    case 'Study':
      return 'Study insight'
    case 'Finance':
      return 'Finance insight'
    case 'Workout':
      return 'Workout insight'
    case 'Sleep':
      return 'Sleep insight'
    default:
      return 'Overview'
  }
})

const activeMetrics = computed(() => {
  if (selectedSection.value === 'Study') {
    return [
      {
        label: 'Today',
        value: formatDuration(todayStudyMinutes.value),
      },
      {
        label: 'This Month',
        value: formatDuration(monthStudyMinutes.value),
      },
      {
        label: 'Streak',
        value: `${currentStudyStreak.value} days`,
        valueClass: 'text-xl font-semibold text-orange-400 sm:text-2xl',
      },
      {
        label: 'Sessions',
        value: studySessionsThisMonth.value,
      },
    ]
  }

  if (selectedSection.value === 'Finance') {
    return [
      {
        label: 'Expense',
        value: formatNumber(monthExpense.value),
      },
      {
        label: 'Income',
        value: formatNumber(monthIncome.value),
      },
      {
        label: 'Net',
        value: formatSignedNumber(monthNet.value),
        valueClass:
          monthNet.value < 0
            ? 'text-xl font-semibold text-red-400 sm:text-2xl'
            : monthNet.value > 0
            ? 'text-xl font-semibold text-blue-400 sm:text-2xl'
            : 'text-xl font-semibold text-white sm:text-2xl',
      },
      {
        label: 'Entries',
        value: financeEntryCount.value,
      },
    ]
  }

  if (selectedSection.value === 'Workout') {
    return [
      {
        label: 'Today',
        value: formatDuration(todayWorkoutMinutes.value),
      },
      {
        label: 'This Month',
        value: formatDuration(monthWorkoutMinutes.value),
      },
      {
        label: 'Sessions',
        value: workoutSessionsThisMonth.value,
      },
      {
        label: 'Top Category',
        value: workoutTopCategory.value,
        hint: workoutTopCategory.value === '—' ? '' : 'Most logged this month',
      },
    ]
  }

  return [
    {
      label: 'Last Sleep',
      value: latestSleepDuration.value,
    },
    {
      label: 'Monthly Avg',
      value: monthSleepCount.value
        ? formatDuration(monthSleepAverageMinutes.value)
        : '—',
    },
    {
      label: 'Quality',
      value: monthSleepAverageQuality.value,
      valueClass: 'text-xl font-semibold text-purple-400 sm:text-2xl',
    },
    {
      label: 'Entries',
      value: monthSleepCount.value,
    },
  ]
})

const activeInsight = computed(() => {
  if (selectedSection.value === 'Study') {
    if (!studyEntries.value.length) {
      return 'No study logged yet. Start with one small session today and let the habit grow softly.'
    }

    if (todayStudyMinutes.value === 0) {
      return 'No study logged today yet. A short session is enough to keep the rhythm alive.'
    }

    if (currentStudyStreak.value >= 5) {
      return 'Your study rhythm is looking strong. Consistency is doing the heavy lifting for you.'
    }

    return 'You are building your study habit steadily. Small sessions still count, especially on busy days.'
  }

  if (selectedSection.value === 'Finance') {
    if (!monthFinanceEntries.value.length) {
      return 'No finance entries for this month yet. Logging even a few small numbers will make your picture clearer.'
    }

    if (monthNet.value < 0) {
      return 'This month is currently net negative. A little awareness now can make the rest of the month feel lighter.'
    }

    if (monthIncome.value > 0 && monthExpense.value === 0) {
      return 'You have logged income, but expenses are still quiet. Keep tracking so the picture stays honest.'
    }

    return 'Your finance data is starting to take shape. Keep logging consistently so the trends become more useful.'
  }

  if (selectedSection.value === 'Workout') {
    if (!workoutEntries.value.length) {
      return 'No workouts logged yet. One light session is enough to give the week some momentum.'
    }

    if (todayWorkoutMinutes.value > 0) {
      return 'You already showed up for yourself today. That counts more than chasing a perfect routine.'
    }

    if (workoutSessionsThisMonth.value >= 8) {
      return 'Your workout consistency is growing nicely this month. Keep protecting that rhythm.'
    }

    return 'Your workouts are building up step by step. Staying regular matters more than doing everything at once.'
  }

  if (!sleepEntries.value.length) {
    return 'No sleep entries yet. Once you log a few nights, this space will start showing a calmer picture.'
  }

  if (monthSleepCount.value >= 5 && monthSleepAverageMinutes.value >= 420) {
    return 'Your sleep pattern looks steadier this month. Protecting rest is one of the kindest things you can do for yourself.'
  }

  return 'A little more sleep tracking will reveal clearer patterns. Gentle consistency works here too.'
})
</script>