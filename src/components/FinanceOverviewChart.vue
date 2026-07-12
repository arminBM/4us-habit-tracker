<template>
  <div class="card p-4">
    <div class="mb-3 flex items-center justify-between">
      <p class="text-sm text-secondary">Expense Trend</p>

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

    <div v-if="series[0].data.length" class="min-h-[220px]">
      <apexchart
        type="line"
        :height="chartHeight"
        :options="chartOptions"
        :series="series"
      />
    </div>

    <div
      v-else
      class="flex h-56 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-[#7C8591]"
    >
      No finance data yet
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { formatDateKey, parseLocalDate } from '../utils/date'

const entriesStore = useEntriesStore()

const ranges = [7, 14, 21]
const selectedRange = ref(7)

const chartHeight = computed(() => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 640) return 240
    if (window.innerWidth < 1024) return 260
  }

  return 280
})

const financeEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Finance')
)

const expenseEntries = computed(() =>
  financeEntries.value.filter(
    entry => (entry.entryKind || 'expense') === 'expense'
  )
)

const recentDays = computed(() => {
  const days = []

  for (let i = selectedRange.value - 1; i >= 0; i--) {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - i)

    days.push({
      key: formatDateKey(date),
      shortLabel: String(date.getDate()),
      fullLabel: new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(date),
    })
  }

  return days
})

const dailyTotals = computed(() => {
  return recentDays.value.map(day => {
    const total = expenseEntries.value.reduce((sum, entry) => {
      return entry.date === day.key ? sum + Number(entry.value) : sum
    }, 0)

    return {
      ...day,
      total,
    }
  })
})

const xAxisLabels = computed(() => {
  return dailyTotals.value.map((item, index) => {
   if (selectedRange.value === 14 || selectedRange.value === 21) {
  return index % 2 === 0 ? item.shortLabel : ''
}
    return item.shortLabel
  })
})

const series = computed(() => [
  {
    name: 'Expense',
    data: dailyTotals.value.map(item => item.total),
  },
])

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
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

  states: {
    normal: {
      filter: { type: 'none', value: 0 },
    },
    hover: {
      filter: { type: 'none', value: 0 },
    },
    active: {
      allowMultipleDataPointsSelection: false,
      filter: { type: 'none', value: 0 },
    },
  },
  theme: {
    mode: 'dark',
  },
  
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  grid: {
    borderColor: 'rgba(255,255,255,0.05)',
    strokeDashArray: 4,
    padding: {
      left: 0,
      right: 10,
      bottom: 0,
    },
  },
  xaxis: {
  categories: xAxisLabels.value,
  tickPlacement: 'on',
  tooltip: {
    enabled: false,
  },
  axisBorder: {
    color: 'rgba(255,255,255,0.10)',
  },
  axisTicks: {
    color: 'rgba(255,255,255,0.10)',
  },
  labels: {
    rotate: 0,
    hideOverlappingLabels: false,
    trim: false,
    style: {
      fontSize:
        typeof window !== 'undefined' && window.innerWidth < 640 ? '10px' : '11px',
      colors: '#9CA3AF',
    },
    maxHeight: 36,
  },
},
  yaxis: {
    forceNiceScale: true,
    labels: {
      style: {
        colors: ['#9CA3AF'],
      },
      formatter: value => Math.round(value).toString(),
    },
  },
  tooltip: {
    theme: 'dark',
    intersect: false,
    shared: false,
    x: {
      formatter: (value, { dataPointIndex }) => {
        return dailyTotals.value[dataPointIndex]?.fullLabel ?? value
      },
    },
    y: {
      formatter: value => `${Math.round(value)}`,
    },
  },
  markers: {
    size: 0,
    strokeWidth: 0,
    hover: {
      size: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  colors: ['#60A5FA'],
}))
</script>