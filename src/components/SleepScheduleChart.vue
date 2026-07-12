<template>
  <div class="card h-full p-4 sm:p-5">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-primary">Sleep Schedule Trend</h3>
      <p class="text-sm text-secondary">
        Bedtime and wake time for {{ financeStore.selectedMonthLabel }}
      </p>
    </div>

    <div
      v-if="hasScheduleData"
      class="h-full min-h-0"
      :class="(isInsightsPage && !props.exportMode)
        ? 'insights-chart-scroll overflow-x-auto overflow-y-hidden pb-1 outline-none focus:outline-none active:outline-none select-none'
        : ''"
    >
      <div
        :class="isInsightsPage
          ? (props.exportMode ? 'h-full w-full' : 'h-full min-w-[980px]')
          : 'h-full w-full'"
      >
        <apexchart
          type="line"
          :width="chartWidth"
          :height="chartHeight"
          :options="chartOptions"
          :series="series"
        />
      </div>
    </div>

    <div
      v-else
      class="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-[#7C8591]"
    >
      No sleep schedule data yet
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { formatDateKey, getDaysInMonth } from '../utils/date'

const props = defineProps({
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
  if (props.exportMode) return 1400

  if (typeof window !== 'undefined') {
    if (isInsightsPage) {
      if (window.innerWidth < 640) return 980
      if (window.innerWidth < 1024) return 980
      return '100%'
    }
  }

  return '100%'
})

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

function getMinutesFromDateTime(value) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.getHours() * 60 + date.getMinutes()
}

function normalizeBedtimeMinutes(value) {
  const minutes = getMinutesFromDateTime(value)
  if (minutes === null) return null
  return minutes < 12 * 60 ? minutes + 24 * 60 : minutes
}

function formatChartTimeLabel(totalMinutes) {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440
  const hours = Math.floor(normalized / 60)
  const minutes = normalized % 60

  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const sleepEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Sleep')
)

const dailySchedule = computed(() => {
  const days = getDaysInMonth(
    financeStore.selectedYear,
    financeStore.selectedMonth
  )

  return days.map(day => {
    const key = formatDateKey(day)

    const entriesForDay = sleepEntries.value.filter(entry => entry.date === key)

    const bedtimes = entriesForDay
      .map(entry => normalizeBedtimeMinutes(entry.sleepStart))
      .filter(v => v !== null)

    const wakeTimes = entriesForDay
      .map(entry => getMinutesFromDateTime(entry.sleepEnd))
      .filter(v => v !== null)

    const avgBedtime =
      bedtimes.length > 0
        ? bedtimes.reduce((sum, v) => sum + v, 0) / bedtimes.length
        : null

    const avgWakeTime =
      wakeTimes.length > 0
        ? wakeTimes.reduce((sum, v) => sum + v, 0) / wakeTimes.length
        : null

    return {
      label: String(day.getDate()),
      fullLabel: new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(day),
      bedtime: avgBedtime !== null ? Number(avgBedtime.toFixed(1)) : null,
      wakeTime: avgWakeTime !== null ? Number(avgWakeTime.toFixed(1)) : null,
    }
  })
})

const hasScheduleData = computed(() =>
  dailySchedule.value.some(item => item.bedtime !== null || item.wakeTime !== null)
)

const series = computed(() => [
  {
    name: 'Bedtime',
    data: dailySchedule.value.map(item => item.bedtime),
  },
  {
    name: 'Wake Time',
    data: dailySchedule.value.map(item => item.wakeTime),
  },
])

const chartOptions = computed(() => ({
  chart: {
  type: 'line',
  toolbar: { show: false },
  zoom: { enabled: false },
  selection: { enabled: false },
  animations: {
    enabled: !props.exportMode,
  },
  background: 'transparent',
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  parentHeightOffset: 0,
},
  states: {
    normal: { filter: { type: 'none', value: 0 } },
    hover: { filter: { type: 'none', value: 0 } },
    active: { filter: { type: 'none', value: 0 } },
  },
  theme: { mode: 'dark' },
  stroke: { curve: 'smooth', width: 3 },
  grid: {
    borderColor: 'rgba(255,255,255,0.05)',
    strokeDashArray: 4,
    padding: { left: 0, right: 10, bottom: 0 },
  },
  xaxis: {
    categories: dailySchedule.value.map(item => item.label),
    tooltip: { enabled: false },
    axisBorder: { color: 'rgba(255,255,255,0.10)' },
    axisTicks: { color: 'rgba(255,255,255,0.10)' },
    labels: {
      show: true,
      rotate: 0,
      hideOverlappingLabels: false,
      trim: false,
      style: {
        fontSize:
          typeof window !== 'undefined' && window.innerWidth < 640 ? '10px' : '11px',
        colors: '#9CA3AF',
      },
    },
  },
  yaxis: {
    min: 0,
    max: 1800,
    tickAmount: 6,
    labels: {
      style: { colors: ['#9CA3AF'] },
      formatter: value => formatChartTimeLabel(value),
    },
  },
  tooltip: {
    theme: 'dark',
    intersect: false,
    shared: false,
    x: {
      formatter: (value, { dataPointIndex }) =>
        dailySchedule.value[dataPointIndex]?.fullLabel ?? value,
    },
    y: {
      formatter: value =>
        value == null ? '—' : formatChartTimeLabel(value),
    },
  },
  markers: {
    size: isInsightsPage ? 3 : 4,
    strokeWidth: 0,
    hover: { size: isInsightsPage ? 5 : 6 },
  },
  dataLabels: {
  enabled: false,
},
  legend: {
    show: true,
    position: 'top',
    labels: { colors: '#9CA3AF' },
  },
  colors: ['#A78BFA', '#60A5FA'],
}))
</script>