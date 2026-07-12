<template>
  <div class="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/50">
    <div class="mb-4">
      <h3 class="text-lg font-semibold">Weekly Study Overview</h3>
      <p class="text-sm text-slate-500">
        Weekly total study time and average focus for {{ financeStore.selectedMonthLabel }}
      </p>
    </div>

    <div v-if="hasData" class="min-h-80">
      <apexchart
        type="bar"
        height="320"
        :options="chartOptions"
        :series="series"
      />
    </div>

    <div
      v-else
      class="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400"
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

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

const studyEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Study')
)

const monthStudyEntries = computed(() =>
  studyEntries.value.filter(entry => {
    const entryDate = parseLocalDate(entry.date)

    return (
      entryDate.getFullYear() === financeStore.selectedYear &&
      entryDate.getMonth() === financeStore.selectedMonth
    )
  })
)

const weeklyBuckets = computed(() => {
  const buckets = Array.from({ length: 4 }, () => ({
    totalMinutes: 0,
    totalFocus: 0,
    count: 0,
    focusCount: 0,
  }))

  for (const entry of monthStudyEntries.value) {
    const entryDate = parseLocalDate(entry.date)
    const weekIndex = getWeekIndexFromDay(entryDate.getDate())

    buckets[weekIndex].totalMinutes += Number(entry.durationMinutes || 0)
    buckets[weekIndex].count += 1

    const focus = Number(entry.focusLevel)
    if (Number.isFinite(focus)) {
      buckets[weekIndex].totalFocus += focus
      buckets[weekIndex].focusCount += 1
    }
  }

  return buckets.map((bucket, index) => ({
    label: weekLabels[index],
    totalHours: Number((bucket.totalMinutes / 60).toFixed(1)),
    avgFocus:
      bucket.focusCount > 0
        ? Number((bucket.totalFocus / bucket.focusCount).toFixed(1))
        : 0,
  }))
})

const series = computed(() => [
  {
    name: 'Study (h)',
    data: weeklyBuckets.value.map(bucket => bucket.totalHours),
  },
  {
    name: 'Avg Focus',
    data: weeklyBuckets.value.map(bucket => bucket.avgFocus),
  },
])

const hasData = computed(() =>
  weeklyBuckets.value.some(
    bucket => bucket.totalHours > 0 || bucket.avgFocus > 0
  )
)

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    toolbar: {
      show: false,
    },
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '45%',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: false,
  },
  grid: {
    borderColor: '#E2E8F0',
    strokeDashArray: 4,
  },
  xaxis: {
    categories: weeklyBuckets.value.map(bucket => bucket.label),
  },
  yaxis: [
    {
      title: {
        text: 'Hours',
      },
      labels: {
        formatter: value => `${value}h`,
      },
    },
    {
      opposite: true,
      min: 0,
      max: 5,
      tickAmount: 5,
      title: {
        text: 'Focus',
      },
      labels: {
        formatter: value => `${value}`,
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
  },
  legend: {
    show: true,
    position: 'top',
  },
  colors: ['#3B82F6', '#8B5CF6'],
}))
</script>