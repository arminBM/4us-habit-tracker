<template>
  <div class="card h-full p-4 sm:p-5">
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-primary">This Month by Weeks</h3>
      <p class="text-sm text-secondary">
        Weekly breakdown of study categories for {{ financeStore.selectedMonthLabel }}
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
      No weekly study data yet
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
  window.location.pathname.includes('/study/insights')

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

const studyCategories = [
  'Reading',
  'Writing',
  'Listening',
  'Speaking',
  'Language Learning',
  'Coding',
  'Research',
  'Exam Prep',
  'Coursework',
  'Other',
]

const categoryColorMap = {
  Reading: '#60A5FA',
  Writing: '#A78BFA',
  Listening: '#22D3EE',
  Speaking: '#34D399',
  'Language Learning': '#F59E0B',
  Coding: '#F87171',
  Research: '#F472B6',
  'Exam Prep': '#FB923C',
  Coursework: '#94A3B8',
  Other: '#64748B',
}

const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

const studyEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Study')
)

const selectedMonthEntries = computed(() => {
  return studyEntries.value.filter(entry => {
    const entryDate = parseLocalDate(entry.date)
    return (
      entryDate.getFullYear() === financeStore.selectedYear &&
      entryDate.getMonth() === financeStore.selectedMonth
    )
  })
})

const weeklyBuckets = computed(() => {
  const buckets = Array.from({ length: 4 }, () => {
    const obj = {}
    studyCategories.forEach(cat => (obj[cat] = 0))
    return obj
  })

  for (const entry of selectedMonthEntries.value) {
    const entryDate = parseLocalDate(entry.date)
    const weekIndex = getWeekIndexFromDay(entryDate.getDate())

    const category = studyCategories.includes(entry.category)
      ? entry.category
      : 'Other'

    buckets[weekIndex][category] += Number(entry.durationMinutes || 0)
  }

  return buckets
})

const series = computed(() => {
  return studyCategories.map(category => ({
    name: category,
    data: weeklyBuckets.value.map(week => week[category]),
  }))
})

const hasData = computed(() =>
  series.value.some(s => s.data.some(v => v > 0))
)

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    zoom: { enabled: false },
    selection: { enabled: false },
    background: 'transparent',
    parentHeightOffset: 0,
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    events: {
      dataPointSelection(_, __, config) {
        emit('select-week', config.dataPointIndex)
      },
    },
  },

  theme: { mode: 'dark' },

  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: isInsightsPage ? '48%' : '52%',
      borderRadiusWhenStacked: 'last',
    },
  },

  xaxis: {
    categories: weekLabels,
    labels: {
      style: {
        colors: Array(weekLabels.length).fill('#9CA3AF'),
      },
    },
  },

  yaxis: {
    labels: {
      formatter: val => `${Math.round(val / 60)}h`,
      style: { colors: ['#9CA3AF'] },
    },
  },

  grid: {
    borderColor: 'rgba(255,255,255,0.05)',
    strokeDashArray: 4,
  },

  legend: {
    position: 'bottom',
    labels: { colors: '#9CA3AF' },
  },

  colors: studyCategories.map(
    cat => categoryColorMap[cat] || categoryColorMap.Other
  ),

  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: val => `${Math.round(val / 60)}h`,
    },
  },

  dataLabels: { enabled: false },
}))
</script>