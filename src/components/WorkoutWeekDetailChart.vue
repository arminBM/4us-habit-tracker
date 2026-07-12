<template>
  <div class="card">
    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-primary">
          {{ weekLabel }} Workout Details
        </h3>
        <p class="text-sm text-secondary">
          Daily workout duration with optional intensity overlay
        </p>
      </div>

      <button
        @click="showIntensity = !showIntensity"
        class="self-start rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-secondary transition hover:bg-white/10 hover:text-primary"
      >
        {{ showIntensity ? 'Hide Intensity' : 'Show Intensity' }}
      </button>
    </div>

    <div class="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:flex sm:flex-wrap sm:gap-4">
      <p class="text-secondary">
        Total:
        <span class="font-semibold text-primary">{{ totalWorkoutLabel }}</span>
      </p>
      <p class="text-secondary">
        Avg:
        <span class="font-semibold text-primary">{{ avgWorkoutLabel }}</span>
      </p>
      <p class="text-secondary">
        Avg Intensity:
        <span class="font-semibold text-primary">{{ avgIntensityLabel }}</span>
      </p>
      <p class="text-secondary">
        Sessions:
        <span class="font-semibold text-primary">{{ sessionsLogged }}</span>
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
      No workout data for this week yet
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

const showIntensity = ref(true)

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

const workoutEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Workout')
)

const dailyBuckets = computed(() => {
  return weekDays.value.map(day => {
    const key = formatDateKey(day)

    const entriesForDay = workoutEntries.value.filter(entry => entry.date === key)

    const totalMinutes = entriesForDay.reduce((sum, entry) => {
      return sum + Number(entry.durationMinutes || 0)
    }, 0)

    const intensityEntries = entriesForDay.filter(entry =>
      Number.isFinite(Number(entry.intensity))
    )

    const avgIntensity =
      intensityEntries.length > 0
        ? Number(
            (
              intensityEntries.reduce((sum, entry) => {
                return sum + Number(entry.intensity)
              }, 0) / intensityEntries.length
            ).toFixed(1)
          )
        : null

    return {
      totalMinutes,
      avgIntensity,
      count: entriesForDay.length,
    }
  })
})

const hasData = computed(() =>
  dailyBuckets.value.some(day => day.totalMinutes > 0 || day.avgIntensity !== null)
)

const totalWorkoutMinutes = computed(() =>
  dailyBuckets.value.reduce((sum, day) => sum + day.totalMinutes, 0)
)

const sessionsLogged = computed(() =>
  dailyBuckets.value.reduce((sum, day) => sum + day.count, 0)
)

const avgWorkoutMinutes = computed(() => {
  if (sessionsLogged.value === 0) return 0
  return Math.round(totalWorkoutMinutes.value / sessionsLogged.value)
})

const avgIntensity = computed(() => {
  const intensityValues = dailyBuckets.value
    .map(day => day.avgIntensity)
    .filter(value => value !== null)

  if (!intensityValues.length) return null

  return Number(
    (
      intensityValues.reduce((sum, value) => sum + value, 0) /
      intensityValues.length
    ).toFixed(1)
  )
})

const totalWorkoutLabel = computed(() => formatDuration(totalWorkoutMinutes.value))
const avgWorkoutLabel = computed(() => formatDuration(avgWorkoutMinutes.value))
const avgIntensityLabel = computed(() =>
  avgIntensity.value === null ? '—' : `${avgIntensity.value}/5`
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
    name: 'Workout (h)',
    type: 'column',
    data: dailyBuckets.value.map(day =>
      Number((day.totalMinutes / 60).toFixed(1))
    ),
  },
  {
    name: 'Intensity',
    type: 'line',
    data: showIntensity.value
      ? dailyBuckets.value.map(day => day.avgIntensity)
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
        text: 'Intensity',
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