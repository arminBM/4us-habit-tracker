<template>
  <div class="card">
    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-primary">
          {{ weekLabel }} Sleep Details
        </h3>
        <p class="text-sm text-secondary">
          Daily sleep duration with optional quality overlay
        </p>
      </div>

      <button
        @click="showQuality = !showQuality"
        class="self-start rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary transition hover:bg-white/10 hover:text-primary"
      >
        {{ showQuality ? 'Hide Quality' : 'Show Quality' }}
      </button>
    </div>

    <div class="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:flex sm:flex-wrap sm:gap-4">
      <p class="text-secondary">
        Total:
        <span class="font-semibold text-primary">{{ totalSleepLabel }}</span>
      </p>
      <p class="text-secondary">
        Avg:
        <span class="font-semibold text-primary">{{ avgSleepLabel }}</span>
      </p>
      <p class="text-secondary">
        Avg Quality:
        <span class="font-semibold text-primary">{{ avgQualityLabel }}</span>
      </p>
      <p class="text-secondary">
        Nights:
        <span class="font-semibold text-primary">{{ nightsLogged }}</span>
      </p>
    </div>

    <div v-if="hasData" class="min-h-80">
      <apexchart
        type="line"
        :height="chartHeight"
        :options="chartOptions"
        :series="series"
      />
    </div>

    <div
      v-else
      class="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-[#7C8591]"
    >
      No sleep data for this week yet
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { formatDateKey } from '../utils/date'
import { getWeekRangeDays } from '../utils/week'

const chartHeight = computed(() => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 640) return 280
    if (window.innerWidth < 1024) return 300
  }
  return 320
})

const props = defineProps({
  weekIndex: {
    type: Number,
    required: true,
  },
})

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

const showQuality = ref(true)

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

const sleepEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Sleep')
)

const dailyBuckets = computed(() => {
  return weekDays.value.map(day => {
    const key = formatDateKey(day)

    const entriesForDay = sleepEntries.value.filter(entry => entry.date === key)

    const totalMinutes = entriesForDay.reduce((sum, entry) => {
      return sum + Number(entry.durationMinutes || 0)
    }, 0)

    const qualityEntries = entriesForDay.filter(entry =>
      Number.isFinite(Number(entry.sleepQuality))
    )

    const avgQuality =
      qualityEntries.length > 0
        ? Number(
            (
              qualityEntries.reduce((sum, entry) => {
                return sum + Number(entry.sleepQuality)
              }, 0) / qualityEntries.length
            ).toFixed(1)
          )
        : null

    return {
      totalMinutes,
      avgQuality,
      count: entriesForDay.length,
    }
  })
})

const hasData = computed(() =>
  dailyBuckets.value.some(day => day.totalMinutes > 0 || day.avgQuality !== null)
)

const totalSleepMinutes = computed(() =>
  dailyBuckets.value.reduce((sum, day) => sum + day.totalMinutes, 0)
)

const nightsLogged = computed(() =>
  dailyBuckets.value.reduce((sum, day) => sum + day.count, 0)
)

const avgSleepMinutes = computed(() => {
  if (nightsLogged.value === 0) return 0
  return Math.round(totalSleepMinutes.value / nightsLogged.value)
})

const avgQuality = computed(() => {
  const qualityValues = dailyBuckets.value
    .map(day => day.avgQuality)
    .filter(value => value !== null)

  if (!qualityValues.length) return null

  return Number(
    (
      qualityValues.reduce((sum, value) => sum + value, 0) /
      qualityValues.length
    ).toFixed(1)
  )
})

const totalSleepLabel = computed(() => formatDuration(totalSleepMinutes.value))
const avgSleepLabel = computed(() => formatDuration(avgSleepMinutes.value))
const avgQualityLabel = computed(() =>
  avgQuality.value === null ? '—' : `${avgQuality.value}/5`
)

const xAxisCategories = computed(() =>
  weekDays.value.map(day =>
    new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      weekday: 'short',
    }).format(day)
  )
)

const series = computed(() => [
  {
    name: 'Sleep (h)',
    type: 'column',
    data: dailyBuckets.value.map(day =>
      Number((day.totalMinutes / 60).toFixed(1))
    ),
  },
  {
    name: 'Quality',
    type: 'line',
    data: showQuality.value
      ? dailyBuckets.value.map(day => day.avgQuality)
      : dailyBuckets.value.map(() => null),
  },
])

const weekLabel = computed(() => `Week ${props.weekIndex + 1}`)

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    stacked: false,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    selection: {
      enabled: false,
    },
    animations: {
      enabled: true,
    },
    background: 'transparent',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    parentHeightOffset: 0,
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

  theme: {
    mode: 'dark',
  },

  stroke: {
  width: [0, 3],
  curve: 'smooth',
},

  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '38%',
    },
  },

  dataLabels: {
    enabled: false,
  },

  xaxis: {
    categories: xAxisCategories.value,
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
      style: {
        fontSize: '12px',
        colors: '#9CA3AF',
      },
    },
  },

  yaxis: [
  {
    title: {
      text: 'Hours',
      style: {
        color: '#9CA3AF',
      },
    },
    labels: {
      style: {
        colors: ['#9CA3AF'],
      },
      formatter: value => `${value}h`,
    },
  },
  {
    opposite: true,
    min: 0,
    max: 5,
    tickAmount: 5,
    title: {
      text: 'Quality',
      style: {
        color: '#9CA3AF',
      },
    },
    labels: {
      style: {
        colors: ['#9CA3AF'],
      },
      formatter: value => `${value}`,
    },
  },
],

  grid: {
    borderColor: 'rgba(255,255,255,0.08)',
    strokeDashArray: 4,
    padding: {
      left: 0,
      right: 4,
      bottom: 0,
    },
  },

 legend: {
  show: true,
  position: 'bottom',
  fontSize: '12px',
  labels: {
    colors: '#9CA3AF',
  },
  
},


  tooltip: {
  theme: 'dark',
  shared: true,
  intersect: false,
  y: [
    {
      formatter: value => `${value}h`,
    },
    {
      formatter: value => (value == null ? '—' : `${value}/5`),
    },
  ],
},

  colors: ['#60A5FA', '#A78BFA'],
}))
</script>