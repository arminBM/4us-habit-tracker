<template>
  <div class="card h-full p-4 sm:p-5">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-primary">Study Duration</h3>
      <p class="text-sm text-secondary">
        Daily study duration for {{ financeStore.selectedMonthLabel }}
      </p>
    </div>

    <div
      v-if="hasData"
      class="h-full min-h-0"
      :class="
        (isInsightsPage && !props.exportMode)
          ? 'insights-chart-scroll overflow-x-auto overflow-y-hidden pb-1 outline-none focus:outline-none active:outline-none select-none'
          : ''
      "
    >
      <div
        :class="
          isInsightsPage
            ? (props.exportMode ? 'h-full w-full' : 'h-full min-w-[980px]')
            : 'h-full w-full'
        "
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
      No monthly study data yet
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
  window.location.pathname.includes('/study/insights')

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

const studyEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Study')
)

const dailyTotals = computed(() => {
  const days = getDaysInMonth(
    financeStore.selectedYear,
    financeStore.selectedMonth
  )

  return days.map(day => {
    const key = formatDateKey(day)

    const totalMinutes = studyEntries.value.reduce((sum, entry) => {
      return entry.date === key
        ? sum + Number(entry.durationMinutes || 0)
        : sum
    }, 0)

    return {
      label: String(day.getDate()),
      fullLabel: new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(day),
      totalHours: Number((totalMinutes / 60).toFixed(1)),
    }
  })
})

const series = computed(() => [
  {
    name: 'Study (h)',
    data: dailyTotals.value.map(item => item.totalHours),
  },
])

const hasData = computed(() =>
  series.value.some(seriesItem =>
    seriesItem.data.some(value => value > 0)
  )
)

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
    categories: dailyTotals.value.map(item => item.label),
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
      show: true,
      rotate: 0,
      rotateAlways: false,
      hideOverlappingLabels: false,
      trim: false,
      offsetY: 2,
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
      formatter: value => `${Number(value).toFixed(0)}h`,
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
      formatter: value => `${value}h`,
    },
  },
  markers: {
    size: isInsightsPage ? 3 : 4,
    strokeWidth: 0,
    hover: {
      size: isInsightsPage ? 5 : 6,
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