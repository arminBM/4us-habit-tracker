<template>
  <div class="card h-full p-4 sm:p-5">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-primary">Weekly Sleep Overview</h3>
      <p class="text-sm text-secondary">
        Weekly average sleep hours and quality for {{ financeStore.selectedMonthLabel }}
      </p>
    </div>

    <div v-if="hasSleepData" class="h-full min-h-0">
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
      No weekly sleep data yet
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
  window.location.pathname.includes('/sleep/insights')

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
      if (window.innerWidth < 640) return '100%'
      if (window.innerWidth < 1024) return '100%'
      return '100%'
    }
  }

  return '100%'
})

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

const sleepEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Sleep')
)

const monthSleepEntries = computed(() =>
  sleepEntries.value.filter(entry => {
    const entryDate = parseLocalDate(entry.date)

    return (
      entryDate.getFullYear() === financeStore.selectedYear &&
      entryDate.getMonth() === financeStore.selectedMonth
    )
  })
)

const weeklyBuckets = computed(() => {
  const buckets = [
    { label: 'Week 1', totalMinutes: 0, totalQuality: 0, count: 0, qualityCount: 0 },
    { label: 'Week 2', totalMinutes: 0, totalQuality: 0, count: 0, qualityCount: 0 },
    { label: 'Week 3', totalMinutes: 0, totalQuality: 0, count: 0, qualityCount: 0 },
    { label: 'Week 4', totalMinutes: 0, totalQuality: 0, count: 0, qualityCount: 0 },
  ]

  for (const entry of monthSleepEntries.value) {
    const entryDate = parseLocalDate(entry.date)
    const dayOfMonth = entryDate.getDate()
    const weekIndex = getWeekIndexFromDay(dayOfMonth)

    buckets[weekIndex].totalMinutes += Number(entry.durationMinutes || 0)
    buckets[weekIndex].count += 1

    const quality = Number(entry.sleepQuality)
    if (Number.isFinite(quality)) {
      buckets[weekIndex].totalQuality += quality
      buckets[weekIndex].qualityCount += 1
    }
  }

  return buckets.map(bucket => {
    const avgHours =
      bucket.count > 0
        ? Number(((bucket.totalMinutes / bucket.count) / 60).toFixed(1))
        : 0

    const avgQuality =
      bucket.qualityCount > 0
        ? Number((bucket.totalQuality / bucket.qualityCount).toFixed(1))
        : 0

    return {
      label: bucket.label,
      avgHours,
      avgQuality,
    }
  })
})

const hasSleepData = computed(() =>
  weeklyBuckets.value.some(bucket => bucket.avgHours > 0 || bucket.avgQuality > 0)
)

const series = computed(() => [
  {
    name: 'Avg Sleep (h)',
    data: weeklyBuckets.value.map(bucket => bucket.avgHours),
  },
  {
    name: 'Avg Quality',
    data: weeklyBuckets.value.map(bucket => bucket.avgQuality),
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