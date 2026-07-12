<template>
  <div class="card p-4 sm:p-5">
    <div class="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold text-primary">Workout by Category</h3>
        <p class="text-sm text-secondary">See how your workout time is distributed</p>
      </div>

      <div class="flex gap-2">
        <button
          @click="scope = 'month'"
          :class="chipClass(scope === 'month')"
        >
          This Month
        </button>

        <button
          @click="scope = 'all'"
          :class="chipClass(scope === 'all')"
        >
          All Time
        </button>
      </div>
    </div>

    <div v-if="series.length" class="min-h-80">
      <apexchart
        type="donut"
        :height="chartHeight"
        :options="chartOptions"
        :series="series"
      />
    </div>

    <div
      v-else
      class="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-[#7C8591]"
    >
      No workout category data yet
    </div>

    <div v-if="sortedCategoryTotals.length" class="mt-6 space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs text-sky-400">Top Category</p>
          <p class="mt-1 text-sm font-semibold text-sky-400">
            {{ highestCategory.category }}
          </p>
          <p class="mt-1 text-xs text-[#9CA3AF]">
            {{ formatDuration(highestCategory.totalMinutes) }}
          </p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs text-violet-400">Lowest Category</p>
          <p class="mt-1 text-sm font-semibold text-violet-400">
            {{ lowestCategory.category }}
          </p>
          <p class="mt-1 text-xs text-[#9CA3AF]">
            {{ formatDuration(lowestCategory.totalMinutes) }}
          </p>
        </div>
      </div>

      <div class="flex justify-center">
    <router-link
      to="/workout/history"
      class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-primary transition hover:bg-white/10"
    >
      View History →
    </router-link>
  </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { parseLocalDate } from '../utils/date'

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

const scope = ref('month')

const isInsightsPage =
  typeof window !== 'undefined' &&
  window.location.pathname.includes('/workout/insights')

const workoutCategories = [
  'Strength',
  'Cardio',
  'Walking',
  'Running',
  'Cycling',
  'Mobility',
  'Stretching',
  'Sports',
  'Home Workout',
  'Other',
]

const categoryColorMap = {
  Strength: '#60A5FA',
  Cardio: '#F87171',
  Walking: '#34D399',
  Running: '#FB923C',
  Cycling: '#22D3EE',
  Mobility: '#A78BFA',
  Stretching: '#F472B6',
  Sports: '#F59E0B',
  'Home Workout': '#94A3B8',
  Other: '#64748B',
}

function chipClass(active) {
  return [
    'whitespace-nowrap rounded-xl px-3 py-2 text-xs transition',
    active
      ? 'bg-white/10 text-[#E6E8EB]'
      : 'text-[#9CA3AF] hover:bg-white/5',
  ]
}

function formatDuration(minutes) {
  const safeMinutes = Number(minutes) || 0
  const h = Math.floor(safeMinutes / 60)
  const m = safeMinutes % 60
  return `${h}h ${m}m`
}

const chartHeight = computed(() => {
  if (typeof window !== 'undefined') {
    if (isInsightsPage) {
      if (window.innerWidth < 640) return 360
      if (window.innerWidth < 1024) return 400
      return 440
    }

    if (window.innerWidth < 640) return 300
    if (window.innerWidth < 1024) return 320
  }

  return 320
})

const workoutEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Workout')
)

const scopedWorkoutEntries = computed(() => {
  if (scope.value === 'all') return workoutEntries.value

  return workoutEntries.value.filter(entry => {
    const entryDate = parseLocalDate(entry.date)

    return (
      entryDate.getFullYear() === financeStore.selectedYear &&
      entryDate.getMonth() === financeStore.selectedMonth
    )
  })
})

const categoryTotals = computed(() => {
  const totals = Object.fromEntries(
    workoutCategories.map(category => [category, 0])
  )

  for (const entry of scopedWorkoutEntries.value) {
    const category = workoutCategories.includes(entry.category)
      ? entry.category
      : 'Other'

    totals[category] += Number(entry.durationMinutes || 0)
  }

  return workoutCategories
    .map(category => ({
      category,
      totalMinutes: totals[category],
    }))
    .filter(item => item.totalMinutes > 0)
})

const sortedCategoryTotals = computed(() =>
  [...categoryTotals.value].sort((a, b) => b.totalMinutes - a.totalMinutes)
)

const highestCategory = computed(() =>
  sortedCategoryTotals.value.length ? sortedCategoryTotals.value[0] : null
)

const lowestCategory = computed(() =>
  sortedCategoryTotals.value.length
    ? sortedCategoryTotals.value[sortedCategoryTotals.value.length - 1]
    : null
)

const labels = computed(() =>
  sortedCategoryTotals.value.map(item => item.category)
)

const series = computed(() =>
  sortedCategoryTotals.value.map(item => item.totalMinutes)
)

const chartOptions = computed(() => ({
  chart: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    toolbar: {
      show: false,
    },
    background: 'transparent',
  },
  theme: {
    mode: 'dark',
  },
  labels: labels.value,
  legend: {
    position: 'bottom',
    fontSize: '12px',
    labels: {
      colors: '#9CA3AF',
    },
    itemMargin: {
      horizontal: 10,
      vertical: 4,
    },
  },
  stroke: {
    width: 0,
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '12px',
      fontWeight: 600,
    },
    dropShadow: {
      enabled: false,
    },
    formatter: value => `${Math.round(value)}%`,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          name: {
            show: true,
            color: '#9CA3AF',
            fontSize: '13px',
            offsetY: 18,
          },
          value: {
            show: true,
            color: '#E6E8EB',
            fontSize: '22px',
            fontWeight: 700,
            offsetY: -10,
            formatter: value => formatDuration(value),
          },
          total: {
            show: true,
            showAlways: true,
            label: scope.value === 'all' ? 'All Time' : 'This Month',
            color: '#9CA3AF',
            fontSize: '13px',
            formatter: () =>
              formatDuration(
                series.value.reduce((sum, value) => sum + Number(value), 0)
              ),
          },
        },
      },
    },
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: value => formatDuration(value),
    },
  },
  states: {
    normal: {
      filter: {
        type: 'none',
        value: 0,
      },
    },
    hover: {
      filter: {
        type: 'none',
        value: 0,
      },
    },
    active: {
      filter: {
        type: 'none',
        value: 0,
      },
    },
  },
  colors: sortedCategoryTotals.value.map(
    item => categoryColorMap[item.category] || categoryColorMap.Other
  ),
}))
</script>