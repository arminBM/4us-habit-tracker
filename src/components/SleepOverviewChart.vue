<template>
  <div class="h-[220px] w-full">
    <apexchart
      type="line"
      :height="220"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { getLocalDateKey, parseLocalDate } from '../utils/date'

const props = defineProps({
  days: {
    type: Number,
    default: 7,
  },
})

const entriesStore = useEntriesStore()

// 👉 filter sleep entries
const sleepEntries = computed(() =>
  entriesStore.entries.filter(e => e.type === 'Sleep')
)

// 👉 generate last N days
function getLastNDays(n) {
  const today = new Date()
  const days = []

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    days.push(d)
  }

  return days
}

const daysList = computed(() => getLastNDays(props.days))

// 👉 map daily sleep
const dailyData = computed(() => {
  return daysList.value.map(day => {
    const key = getLocalDateKey(day)

    const totalMinutes = sleepEntries.value.reduce((sum, entry) => {
      return entry.date === key
        ? sum + Number(entry.durationMinutes || 0)
        : sum
    }, 0)

    return Number((totalMinutes / 60).toFixed(1))
  })
})

// 👉 labels (clean)
const categories = computed(() =>
  daysList.value.map(d =>
    new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
    }).format(d)
  )
)

// 👉 series
const series = computed(() => [
  {
    name: 'Sleep',
    data: dailyData.value,
  },
])

// 👉 chart options (minimal style)
const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    toolbar: { show: false },
    zoom: { enabled: false },
    background: 'transparent',
    parentHeightOffset: 0,
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  },

  theme: {
    mode: 'dark',
  },

  stroke: {
    curve: 'smooth',
    width: 3,
  },

  markers: {
    size: 0, // 🔥 no dots (important)
  },

  grid: {
    borderColor: 'rgba(255,255,255,0.05)',
    strokeDashArray: 3,
    padding: {
      left: 0,
      right: 6,
    },
  },

  xaxis: {
    categories: categories.value,
  tickAmount: Math.min(props.days, 7),
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: {
      enabled: false,
    },
    labels: {
        show: true,
      style: {
        fontSize: '11px',
        colors: '#7C8591',
      },
    },
  },

  yaxis: {
    labels: {
        
      style: {
        colors: ['#7C8591'],
      },
      formatter: val => `${val}h`,
    },
  },

  tooltip: {
    theme: 'dark',
    x: {
      formatter: (val, { dataPointIndex }) => {
        const date = daysList.value[dataPointIndex]
        return new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }).format(date)
      },
    },
    y: {
      formatter: val => `${val}h`,
    },
  },

  dataLabels: {
    enabled: false,
  },

  legend: {
    show: false, // 🔥 important
  },

  colors: ['#60A5FA'],
}))
</script>