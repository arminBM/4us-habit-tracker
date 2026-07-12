<template>
  <div class="card p-4 sm:p-5">
    <div class="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold text-primary">
          {{ weekLabel }} Details
        </h3>
        <p class="text-sm text-secondary">
          Daily breakdown of income and expenses
        </p>
      </div>

      <button
        @click="showIncome = !showIncome"
        class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-secondary transition hover:bg-white/10"
      >
        {{ showIncome ? 'Hide Income' : 'Show Income' }}
      </button>
    </div>

    <!-- Totals -->
    <div class="mb-5 grid grid-cols-3 gap-3 text-xs">
      <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p class="text-[#9CA3AF]">Income</p>
        <p class="mt-1 font-semibold text-emerald-400">
          {{ formatAmount(totals.income) }}
        </p>
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p class="text-[#9CA3AF]">Expense</p>
        <p class="mt-1 font-semibold text-red-400">
          {{ formatAmount(totals.expense) }}
        </p>
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p class="text-[#9CA3AF]">Net</p>
        <p
          class="mt-1 font-semibold"
          :class="totals.net >= 0 ? 'text-emerald-400' : 'text-red-400'"
        >
          {{ formatAmount(totals.net) }}
        </p>
      </div>
    </div>

    <!-- Chart -->
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
      No finance data for this week yet
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { formatDateKey } from '../utils/date'
import { getWeekRangeDays } from '../utils/week'

const props = defineProps({
  weekIndex: {
    type: Number,
    required: true,
  },
})

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

const showIncome = ref(true)

function formatAmount(value) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

const isInsightsPage =
  typeof window !== 'undefined' &&
  window.location.pathname.includes('/finance/insights')

const chartHeight = computed(() => {
  if (typeof window !== 'undefined') {
    if (isInsightsPage) {
      if (window.innerWidth < 640) return 380
      if (window.innerWidth < 1024) return 460
      return 540
    }

    if (window.innerWidth < 640) return 300
    if (window.innerWidth < 1024) return 320
  }

  return 320
})

const expenseCategories = [
  'Coffee Shop',
  'Groceries',
  'Transport',
  'Eating Out',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Education',
  'Other',
]

const categoryColorMap = {
  Income: '#34D399',
  'Coffee Shop': '#F59E0B',
  Groceries: '#22C55E',
  Transport: '#3B82F6',
  'Eating Out': '#F97316',
  Shopping: '#8B5CF6',
  Bills: '#64748B',
  Health: '#EF4444',
  Entertainment: '#EC4899',
  Education: '#6366F1',
  Other: '#94A3B8',
}

const weekDays = computed(() =>
  getWeekRangeDays(
    financeStore.selectedYear,
    financeStore.selectedMonth,
    props.weekIndex
  )
)

const financeEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Finance')
)

const dailyBuckets = computed(() => {
  return weekDays.value.map(day => {
    const key = formatDateKey(day)

    const bucket = {
      Income: 0,
      ...Object.fromEntries(expenseCategories.map(c => [c, 0])),
    }

    for (const entry of financeEntries.value) {
      if (entry.date !== key) continue

      const value = Number(entry.value || 0)
      const kind = entry.entryKind || 'expense'

      if (kind === 'income') {
        bucket.Income += value
      } else {
        const category = expenseCategories.includes(entry.category)
          ? entry.category
          : 'Other'

        bucket[category] += value
      }
    }

    return bucket
  })
})

const totals = computed(() => {
  let income = 0
  let expense = 0

  for (const day of dailyBuckets.value) {
    income += day.Income
    for (const c of expenseCategories) {
      expense += day[c]
    }
  }

  return {
    income,
    expense,
    net: income - expense,
  }
})

const series = computed(() => {
  const expenseSeries = expenseCategories.map(category => ({
    name: category,
    group: 'expenses',
    data: dailyBuckets.value.map(day => day[category]),
  }))

  if (!showIncome.value) return expenseSeries

  return [
    {
      name: 'Income',
      group: 'income',
      data: dailyBuckets.value.map(day => day.Income),
    },
    ...expenseSeries,
  ]
})

const hasData = computed(() =>
  series.value.some(s => s.data.some(v => v > 0))
)

const weekLabel = computed(() => `Week ${props.weekIndex + 1}`)

const xAxisCategories = computed(() =>
  weekDays.value.map(day =>
    new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      weekday: 'short',
    }).format(day)
  )
)

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    stackOnlyBar: true,
    toolbar: { show: false },
    background: 'transparent',
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    selection: {
      enabled: false,
    },
    zoom: {
      enabled: false,
    },
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
      horizontal: false,
      borderRadius: 2,
      columnWidth: '50%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
    },
  },
  xaxis: {
    categories: xAxisCategories.value,
    labels: {
      style: {
        colors: Array(xAxisCategories.value.length).fill('#9CA3AF'),
        fontSize: '11px',
      },
    },
    axisBorder: {
      color: 'rgba(255,255,255,0.10)',
    },
    axisTicks: {
      color: 'rgba(255,255,255,0.10)',
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: ['#9CA3AF'],
      },
      formatter: v => Math.round(v).toString(),
    },
  },
  grid: {
    borderColor: 'rgba(255,255,255,0.05)',
    strokeDashArray: 4,
  },
  legend: {
    position: 'bottom',
    fontSize: '12px',
    labels: {
      colors: '#9CA3AF',
    },
    clusterGroupedSeries: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    theme: 'dark',
    shared: true,
    intersect: false,
    y: {
      formatter: v => formatAmount(v),
    },
  },
  colors: series.value.map(item => categoryColorMap[item.name]),
}))
</script>