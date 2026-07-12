<template>
  <div class="card h-full p-4 sm:p-5">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-primary">Weekly Workout Overview</h3>
      <p class="text-sm text-secondary">
        Weekly workout hours and average intensity for {{ financeStore.selectedMonthLabel }}
      </p>
    </div>

    <div v-if="hasData" class="h-full min-h-0">
      <apexchart
        type="bar"
        :width="chartWidth"
        :height="chartHeight"
        :options="chartOptions"
        :series="series"
      />
    </div>

    <div
      v-else
      class="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-[#7C8591]"
    >
      No weekly workout data yet
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { parseLocalDate } from '../utils/date'
import { getWeekIndexFromDay } from '../utils/week'

const emit = defineEmits(['select-week'])

const props = defineProps({
  selectedWeekIndex: {
    type: Number,
    default: null,
  },
  exportMode: {
    type: Boolean,
    default: false,
  },
})

const isInsightsPage =
  typeof window !== 'undefined' &&
  window.location.pathname.includes('/workout/insights')

const chartHeight = computed(() => {
  if (typeof window !== 'undefined') {
    if (isInsightsPage) {
      if (window.innerWidth < 640) return 430
      if (window.innerWidth < 1024) return 520
      return 620
    }

    if (window.innerWidth < 640) return 280
    if (window.innerWidth < 1024) return 300
  }

  return 320
})

const chartWidth = computed(() => {
  if (props.exportMode) return 1100

  if (typeof window !== 'undefined') {
    if (isInsightsPage) {
      return '100%'
    }
  }

  return '100%'
})

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

const workoutEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Workout')
)

const monthWorkoutEntries = computed(() =>
  workoutEntries.value.filter(entry => {
    const entryDate = parseLocalDate(entry.date)

    return (
      entryDate.getFullYear() === financeStore.selectedYear &&
      entryDate.getMonth() === financeStore.selectedMonth
    )
  })
)

const weeklyBuckets = computed(() => {
  const buckets = [
    { label: 'Week 1', totalMinutes: 0, totalIntensity: 0, count: 0, intensityCount: 0 },
    { label: 'Week 2', totalMinutes: 0, totalIntensity: 0, count: 0, intensityCount: 0 },
    { label: 'Week 3', totalMinutes: 0, totalIntensity: 0, count: 0, intensityCount: 0 },
    { label: 'Week 4', totalMinutes: 0, totalIntensity: 0, count: 0, intensityCount: 0 },
  ]

  for (const entry of monthWorkoutEntries.value) {
    const entryDate = parseLocalDate(entry.date)
    const dayOfMonth = entryDate.getDate()
    const weekIndex = getWeekIndexFromDay(dayOfMonth)

    buckets[weekIndex].totalMinutes += Number(entry.durationMinutes || 0)
    buckets[weekIndex].count += 1

    const intensity = Number(entry.intensity)
    if (Number.isFinite(intensity)) {
      buckets[weekIndex].totalIntensity += intensity
      buckets[weekIndex].intensityCount += 1
    }
  }

  return buckets.map(bucket => {
    const totalHours = Number((bucket.totalMinutes / 60).toFixed(1))

    const avgIntensity =
      bucket.intensityCount > 0
        ? Number((bucket.totalIntensity / bucket.intensityCount).toFixed(1))
        : 0

    return {
      label: bucket.label,
      totalHours,
      avgIntensity,
    }
  })
})

const hasData = computed(() =>
  weeklyBuckets.value.some(bucket => bucket.totalHours > 0 || bucket.avgIntensity > 0)
)

const series = computed(() => [
  {
    name: 'Workout (h)',
    data: weeklyBuckets.value.map(bucket => bucket.totalHours),
  },
  {
    name: 'Avg Intensity',
    data: weeklyBuckets.value.map(bucket => bucket.avgIntensity),
    yAxisIndex: 1,
  },
])

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
    animations: {
      enabled: !props.exportMode,
    },
    background: 'transparent',
    events: {
      dataPointSelection(event, chartContext, config) {
        const weekIndex = config.dataPointIndex
        emit('select-week', weekIndex)
      },
    },
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
      borderRadius: 2,
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
    categories: weeklyBuckets.value.map(bucket => bucket.label),
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
  tooltip: {
    theme: 'dark',
    shared: true,
    intersect: false,
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'center',
    fontSize:
      typeof window !== 'undefined' && window.innerWidth < 640 ? '11px' : '12px',
    itemMargin: {
      horizontal: 10,
      vertical: 0,
    },
    labels: {
      colors: '#9CA3AF',
    },
  },
  colors: ['#60A5FA', '#A78BFA'],
}))
</script>