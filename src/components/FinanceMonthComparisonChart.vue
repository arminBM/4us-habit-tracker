<template>
  <div class="card p-4 sm:p-5">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-primary">Month Comparison</h3>
      <p class="text-sm text-secondary">
        Income vs expense vs net across recent months
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
      No month comparison data yet
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

const isInsightsPage =
  typeof window !== 'undefined' &&
  window.location.pathname.includes('/finance/insights')

function parseLocalDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getRecentMonths(selectedYear, selectedMonth, count = 6) {
  const months = []

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(selectedYear, selectedMonth - i, 1)
    months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      label: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: '2-digit',
      }).format(date),
    })
  }

  return months
}

const chartHeight = computed(() => {
  if (typeof window !== 'undefined') {
    if (isInsightsPage) {
      if (window.innerWidth < 640) return 380
      if (window.innerWidth < 1024) return 450
      return 520
    }

    if (window.innerWidth < 640) return 320
    if (window.innerWidth < 1024) return 340
  }

  return 340
})

const financeEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Finance')
)

const recentMonths = computed(() =>
  getRecentMonths(financeStore.selectedYear, financeStore.selectedMonth, 6)
)

const monthTotals = computed(() => {
  return recentMonths.value.map(monthItem => {
    let income = 0
    let expense = 0

    for (const entry of financeEntries.value) {
      const entryDate = parseLocalDate(entry.date)

      const sameMonth =
        entryDate.getFullYear() === monthItem.year &&
        entryDate.getMonth() === monthItem.month

      if (!sameMonth) continue

      const value = Number(entry.value)
      const kind = entry.entryKind || 'expense'

      if (kind === 'income') {
        income += value
      } else {
        expense += value
      }
    }

    const net = income - expense

    return {
      label: monthItem.label,
      income,
      expense,
      net,
    }
  })
})

const series = computed(() => {
  const income = monthTotals.value.map(m => m.income)
  const expense = monthTotals.value.map(m => m.expense)
  const netPositive = monthTotals.value.map(m => (m.net > 0 ? m.net : 0))
  const netNegative = monthTotals.value.map(m => (m.net < 0 ? m.net : 0))

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
  series.value.some(seriesItem => seriesItem.data.some(value => value !== 0))
)

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: false,
    toolbar: {
      show: false,
    },
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
      columnWidth: '46%',
      borderRadiusApplication: 'end',
    },
  },
  xaxis: {
    categories: monthTotals.value.map(m => m.label),
    axisBorder: {
      color: 'rgba(255,255,255,0.10)',
    },
    axisTicks: {
      color: 'rgba(255,255,255,0.10)',
    },
    labels: {
      style: {
        colors: Array(monthTotals.value.length).fill('#9CA3AF'),
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