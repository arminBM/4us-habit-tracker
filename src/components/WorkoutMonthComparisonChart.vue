<template>
  <div class="card h-full p-4 sm:p-5">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-primary">Workout by Month</h3>
      <p class="text-sm text-secondary">
        Compare total workout time across recent months
      </p>
    </div>

    <div v-if="hasData" class="h-full min-h-0">
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
      No monthly workout data yet
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { parseLocalDate } from '../utils/date'

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

const isInsightsPage =
  typeof window !== 'undefined' &&
  window.location.pathname.includes('/workout/insights')

const chartHeight = computed(() => {
  if (typeof window !== 'undefined') {
    if (isInsightsPage) {
      if (window.innerWidth < 640) return 420
      if (window.innerWidth < 1024) return 500
      return 580
    }

    if (window.innerWidth < 640) return 300
    if (window.innerWidth < 1024) return 320
  }

  return 340
})

function formatDuration(minutes) {
  const safeMinutes = Number(minutes) || 0
  const h = Math.floor(safeMinutes / 60)
  const m = safeMinutes % 60
  return `${h}h ${m}m`
}

function getRecentMonths(count = 6) {
  const months = []

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(financeStore.selectedYear, financeStore.selectedMonth, 1)
    date.setMonth(date.getMonth() - i)

    months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      label: new Intl.DateTimeFormat('en-US', {
        month: 'short',
      }).format(date),
    })
  }

  return months
}

const monthBuckets = computed(() => getRecentMonths(6))

const workoutEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Workout')
)

const monthlyTotals = computed(() => {
  return monthBuckets.value.map(bucket => {
    const totalMinutes = workoutEntries.value.reduce((sum, entry) => {
      const entryDate = parseLocalDate(entry.date)

      const sameMonth =
        entryDate.getFullYear() === bucket.year &&
        entryDate.getMonth() === bucket.month

      return sameMonth
        ? sum + Number(entry.durationMinutes || 0)
        : sum
    }, 0)

    return {
      ...bucket,
      totalMinutes,
      totalHours: Number((totalMinutes / 60).toFixed(1)),
    }
  })
})

const series = computed(() => [
  {
    name: 'Workout (h)',
    data: monthlyTotals.value.map(item => item.totalHours),
  },
])

const hasData = computed(() =>
  series.value.some(s => s.data.some(v => v > 0))
)

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    selection: {
      enabled: false,
    },
    background: 'transparent',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    parentHeightOffset: 0,
  },
  theme: {
    mode: 'dark',
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
      borderRadius: 6,
      columnWidth:
        typeof window !== 'undefined' && window.innerWidth < 640
          ? '42%'
          : '36%',
      endingShape: 'rounded',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: false,
  },
  grid: {
    borderColor: 'rgba(255,255,255,0.05)',
    strokeDashArray: 4,
    padding: {
      left: 2,
      right: 6,
      bottom: 0,
    },
  },
  xaxis: {
    categories: monthlyTotals.value.map(item => item.label),
    axisBorder: {
      color: 'rgba(255,255,255,0.10)',
    },
    axisTicks: {
      color: 'rgba(255,255,255,0.10)',
    },
    labels: {
      style: {
        fontSize:
          typeof window !== 'undefined' && window.innerWidth < 640 ? '11px' : '12px',
        colors: Array(monthlyTotals.value.length).fill('#9CA3AF'),
      },
    },
  },
  yaxis: {
    forceNiceScale: true,
    labels: {
      style: {
        colors: ['#9CA3AF'],
      },
      formatter: value => `${Math.round(value)}h`,
    },
  },
  tooltip: {
    theme: 'dark',
    shared: false,
    intersect: false,
    y: {
      formatter: value => formatDuration(value * 60),
    },
  },
  legend: {
    show: false,
  },
  colors: ['#60A5FA'],
}))
</script>