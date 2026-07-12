<template>
  <div class="card h-full p-4 sm:p-5">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-primary">This Month by Weeks</h3>
      <p class="text-sm text-secondary">
        Weekly stacked view of income and expense categories for {{ financeStore.selectedMonthLabel }}
      </p>
    </div>

    <div v-if="hasData" class="h-full min-h-0">
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
      No weekly finance data yet
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

const financeStore = useFinanceStore()
const entriesStore = useEntriesStore()

const isInsightsPage =
  typeof window !== 'undefined' &&
  window.location.pathname.includes('/finance/insights')

const chartHeight = computed(() => {
  if (typeof window !== 'undefined') {
    if (isInsightsPage) {
      if (window.innerWidth < 640) return 420
      if (window.innerWidth < 1024) return 500
      return 580
    }

    if (window.innerWidth < 640) return 300
    if (window.innerWidth < 1024) return 320
  }

  return 340
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

const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

const categoryColorMap = {
  Income: '#11bc4f',
  'Coffee Shop': '#F59E0B',
  Groceries: '#b00000',
  Transport: '#3B82F6',
  'Eating Out': '#F97316',
  Shopping: '#8B5CF6',
  Bills: '#64748B',
  Health: '#EF4444',
  Entertainment: '#EC4899',
  Education: '#6366F1',
  Other: '#94A3B8',
}

const financeEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Finance')
)

const selectedMonthEntries = computed(() => {
  return financeEntries.value.filter((entry) => {
    const entryDate = parseLocalDate(entry.date)
    return (
      entryDate.getFullYear() === financeStore.selectedYear &&
      entryDate.getMonth() === financeStore.selectedMonth
    )
  })
})

const weeklyBuckets = computed(() => {
  const buckets = Array.from({ length: 4 }, () => ({
    Income: 0,
    'Coffee Shop': 0,
    Groceries: 0,
    Transport: 0,
    'Eating Out': 0,
    Shopping: 0,
    Bills: 0,
    Health: 0,
    Entertainment: 0,
    Education: 0,
    Other: 0,
  }))

  for (const entry of selectedMonthEntries.value) {
    const entryDate = parseLocalDate(entry.date)
    const weekIndex = getWeekIndexFromDay(entryDate.getDate())
    const entryKind = entry.entryKind || 'expense'

    if (entryKind === 'income') {
      buckets[weekIndex].Income += Number(entry.value)
    } else {
      const category = expenseCategories.includes(entry.category)
        ? entry.category
        : 'Other'

      buckets[weekIndex][category] += Number(entry.value)
    }
  }

  return buckets
})

const series = computed(() => {
  const orderedKeys = ['Income', ...expenseCategories]

  return orderedKeys.map((key) => ({
    name: key,
    data: weeklyBuckets.value.map((week) => week[key]),
  }))
})

const hasData = computed(() =>
  series.value.some((item) => item.data.some((value) => value > 0))
)

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
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
    events: {
      dataPointSelection(event, chartContext, config) {
        const weekIndex = config.dataPointIndex
        emit('select-week', weekIndex)
      },
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
  theme: {
    mode: 'dark',
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 6,
      columnWidth: isInsightsPage ? '48%' : '52%',
      borderRadiusApplication: 'end',
      borderRadiusWhenStacked: 'last',
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
        fontSize:
          typeof window !== 'undefined' && window.innerWidth < 640 ? '11px' : '12px',
        colors: Array(weekLabels.length).fill('#9CA3AF'),
      },
    },
  },
  yaxis: {
    forceNiceScale: true,
    labels: {
      style: {
        colors: ['#9CA3AF'],
      },
      formatter: (value) => Math.round(value).toString(),
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
    categoryColorMap.Income,
    categoryColorMap['Coffee Shop'],
    categoryColorMap.Groceries,
    categoryColorMap.Transport,
    categoryColorMap['Eating Out'],
    categoryColorMap.Shopping,
    categoryColorMap.Bills,
    categoryColorMap.Health,
    categoryColorMap.Entertainment,
    categoryColorMap.Education,
    categoryColorMap.Other,
  ],
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    theme: 'dark',
    shared: true,
    intersect: false,
    y: {
      formatter: (value) => `${value}`,
    },
  },
}))
</script>