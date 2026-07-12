<template>
  <div class="card p-4 sm:p-5">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-primary">Weekly Comparison</h3>
      <p class="text-sm text-secondary">
        Income vs expense vs net for {{ financeStore.selectedMonthLabel }}
      </p>
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
      No weekly comparison data yet
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { parseLocalDate } from '../utils/date'
import { getWeekIndexFromDay } from '../utils/week'

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

const isInsightsPage =
  typeof window !== 'undefined' &&
  window.location.pathname.includes('/finance/insights')

const chartHeight = computed(() => {
  if (typeof window !== 'undefined') {
    if (isInsightsPage) {
      if (window.innerWidth < 640) return 360
      if (window.innerWidth < 1024) return 430
      return 500
    }

    if (window.innerWidth < 640) return 300
    if (window.innerWidth < 1024) return 320
  }

  return 320
})

const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

const financeEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Finance')
)

const selectedMonthEntries = computed(() => {
  return financeEntries.value.filter(entry => {
    const entryDate = parseLocalDate(entry.date)
    return (
      entryDate.getFullYear() === financeStore.selectedYear &&
      entryDate.getMonth() === financeStore.selectedMonth
    )
  })
})

const weeklyTotals = computed(() => {
  const buckets = Array.from({ length: 4 }, () => ({
    income: 0,
    expense: 0,
    net: 0,
  }))

  for (const entry of selectedMonthEntries.value) {
    const entryDate = parseLocalDate(entry.date)
    const weekIndex = getWeekIndexFromDay(entryDate.getDate())

    const value = Number(entry.value)
    const kind = entry.entryKind || 'expense'

    if (kind === 'income') {
      buckets[weekIndex].income += value
      buckets[weekIndex].net += value
    } else {
      buckets[weekIndex].expense += value
      buckets[weekIndex].net -= value
    }
  }

  return buckets
})

const series = computed(() => {
  const income = weeklyTotals.value.map(w => w.income)
  const expense = weeklyTotals.value.map(w => w.expense)
  const netPositive = weeklyTotals.value.map(w => (w.net > 0 ? w.net : 0))
  const netNegative = weeklyTotals.value.map(w => (w.net < 0 ? w.net : 0))

  return [
    {
      name: 'Income',
      data: income,
    },
    {
      name: 'Expense',
      data: expense,
    },
    {
      name: 'Net +',
      data: netPositive,
    },
    {
      name: 'Net -',
      data: netNegative,
    },
  ]
})

const hasData = computed(() =>
  series.value.some(s => s.data.some(v => v !== 0))
)

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: false,
    toolbar: { show: false },
    background: 'transparent',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    zoom: {
      enabled: false,
    },
    selection: {
      enabled: false,
    },
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
  plotOptions: {
    bar: {
      borderRadius: 2,
      columnWidth: '42%',
      borderRadiusApplication: 'end',
    },
  },
  xaxis: {
    categories: weekLabels,
    axisBorder: {
      color: 'rgba(255,255,255,0.10)',
    },
    axisTicks: {
      color: 'rgba(255,255,255,0.10)',
    },
    labels: {
      style: {
        colors: Array(weekLabels.length).fill('#9CA3AF'),
        fontSize:
          typeof window !== 'undefined' && window.innerWidth < 640 ? '11px' : '12px',
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: ['#9CA3AF'],
      },
      formatter: value => Math.round(value).toString(),
    },
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
  legend: {
    position: 'bottom',
    fontSize: '12px',
    labels: {
      colors: '#9CA3AF',
    },
    itemMargin: {
      horizontal: 10,
      vertical: 4,
    },
  },
  colors: [
    '#22C55E', // Income
    '#EF4444', // Expense
    '#3B82F6', // Net positive
    '#F97316', // Net negative
  ],
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: value => `${Math.round(value)}`,
    },
  },
}))
</script>