<template>
  <div class="card p-4 sm:p-5">
    <div class="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold text-primary">
          {{ weekLabel }} Details
        </h3>
        <p class="text-sm text-secondary">
          Daily breakdown of study categories
        </p>
      </div>
    </div>

    <div class="mb-5 grid grid-cols-3 gap-3 text-xs">
      <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p class="text-[#9CA3AF]">Total</p>
        <p class="mt-1 font-semibold text-sky-400">
          {{ formatDuration(totalMinutes) }}
        </p>
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p class="text-[#9CA3AF]">Avg / Day</p>
        <p class="mt-1 font-semibold text-violet-400">
          {{ formatDuration(avgMinutesPerDay) }}
        </p>
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p class="text-[#9CA3AF]">Sessions</p>
        <p class="mt-1 font-semibold text-primary">
          {{ sessionsLogged }}
        </p>
      </div>
    </div>

    <div v-if="hasData" class="min-h-80">
      <apexchart
        type="bar"
        :height="chartHeight"
        :options="chartOptions"
        :series="series"
      />
    </div>

    <div
      v-else
      class="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-[#7C8591]"
    >
      No study data for this week yet
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { formatDateKey } from '../utils/date'
import { getWeekRangeDays } from '../utils/week'

const props = defineProps({
  weekIndex: {
    type: Number,
    required: true,
  },
})

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

const isInsightsPage =
  typeof window !== 'undefined' &&
  window.location.pathname.includes('/study/insights')

const chartHeight = computed(() => {
  if (typeof window !== 'undefined') {
    if (isInsightsPage) {
      if (window.innerWidth < 640) return 380
      if (window.innerWidth < 1024) return 460
      return 540
    }

    if (window.innerWidth < 640) return 300
    if (window.innerWidth < 1024) return 320
  }

  return 320
})

const studyCategories = [
  'Reading',
  'Writing',
  'Listening',
  'Speaking',
  'Language Learning',
  'Coding',
  'Research',
  'Exam Prep',
  'Coursework',
  'Other',
]

const categoryColorMap = {
  Reading: '#60A5FA',
  Writing: '#A78BFA',
  Listening: '#22D3EE',
  Speaking: '#34D399',
  'Language Learning': '#F59E0B',
  Coding: '#F87171',
  Research: '#F472B6',
  'Exam Prep': '#FB923C',
  Coursework: '#94A3B8',
  Other: '#64748B',
}

function formatDuration(minutes) {
  const safeMinutes = Number(minutes) || 0
  const h = Math.floor(safeMinutes / 60)
  const m = safeMinutes % 60
  return `${h}h ${m}m`
}

const weekDays = computed(() =>
  getWeekRangeDays(
    financeStore.selectedYear,
    financeStore.selectedMonth,
    props.weekIndex
  )
)

const studyEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Study')
)

const dailyBuckets = computed(() => {
  return weekDays.value.map(day => {
    const key = formatDateKey(day)

    const bucket = Object.fromEntries(
      studyCategories.map(category => [category, 0])
    )

    let count = 0

    for (const entry of studyEntries.value) {
      if (entry.date !== key) continue

      const category = studyCategories.includes(entry.category)
        ? entry.category
        : 'Other'

      bucket[category] += Number(entry.durationMinutes || 0)
      count += 1
    }

    return {
      ...bucket,
      count,
    }
  })
})

const totalMinutes = computed(() =>
  dailyBuckets.value.reduce((sum, day) => {
    return (
      sum +
      studyCategories.reduce((daySum, category) => daySum + day[category], 0)
    )
  }, 0)
)

const sessionsLogged = computed(() =>
  dailyBuckets.value.reduce((sum, day) => sum + day.count, 0)
)

const avgMinutesPerDay = computed(() => {
  const activeDays = dailyBuckets.value.filter(day =>
    studyCategories.some(category => day[category] > 0)
  ).length

  if (!activeDays) return 0
  return Math.round(totalMinutes.value / activeDays)
})

const series = computed(() =>
  studyCategories.map(category => ({
    name: category,
    data: dailyBuckets.value.map(day => day[category]),
  }))
)

const hasData = computed(() =>
  series.value.some(s => s.data.some(v => v > 0))
)

const weekLabel = computed(() => `Week ${props.weekIndex + 1}`)

const xAxisCategories = computed(() =>
  weekDays.value.map(day =>
    new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      weekday: 'short',
    }).format(day)
  )
)

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    stackOnlyBar: true,
    toolbar: { show: false },
    background: 'transparent',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    selection: {
      enabled: false,
    },
    zoom: {
      enabled: false,
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
      allowMultipleDataPointsSelection: false,
      filter: {
        type: 'none',
        value: 0,
      },
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 2,
      columnWidth: '50%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  xaxis: {
    categories: xAxisCategories.value,
    labels: {
      style: {
        colors: Array(xAxisCategories.value.length).fill('#9CA3AF'),
        fontSize: '11px',
      },
    },
    axisBorder: {
      color: 'rgba(255,255,255,0.10)',
    },
    axisTicks: {
      color: 'rgba(255,255,255,0.10)',
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: ['#9CA3AF'],
      },
      formatter: v => `${Math.round(v / 60)}h`,
    },
  },
  grid: {
    borderColor: 'rgba(255,255,255,0.05)',
    strokeDashArray: 4,
  },
  legend: {
    position: 'bottom',
    fontSize: '12px',
    labels: {
      colors: '#9CA3AF',
    },
    clusterGroupedSeries: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    theme: 'dark',
    shared: true,
    intersect: false,
    y: {
      formatter: v => formatDuration(v),
    },
  },
  colors: studyCategories.map(category => categoryColorMap[category]),
}))
</script>