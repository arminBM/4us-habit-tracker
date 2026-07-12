<template>
  <div class="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/50">
    <div class="mb-4">
      <h3 class="text-lg font-semibold">Entries by Type</h3>
      <p class="text-sm text-slate-500">A quick breakdown of your logs</p>
    </div>

    <div v-if="series.length" class="min-h-80">
      <apexchart
        type="donut"
        height="320"
        :options="chartOptions"
        :series="series"
      />
    </div>

    <div
      v-else
      class="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400"
    >
      No chart data yet
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'

const entriesStore = useEntriesStore()

const typeCounts = computed(() => {
  const counts = {
    Finance: 0,
    Workout: 0,
    Study: 0,
    Sleep: 0,
  }

  for (const entry of entriesStore.entries) {
    if (counts[entry.type] !== undefined) {
      counts[entry.type]++
    }
  }

  return counts
})

const labels = computed(() =>
  Object.keys(typeCounts.value).filter(label => typeCounts.value[label] > 0)
)

const series = computed(() =>
  Object.values(typeCounts.value).filter(value => value > 0)
)

const chartOptions = computed(() => ({
  chart: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    toolbar: {
      show: false,
    },
  },
  labels: labels.value,
  legend: {
    position: 'bottom',
    fontSize: '14px',
  },
  dataLabels: {
    enabled: true,
  },
  stroke: {
    width: 0,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
      },
    },
  },
  tooltip: {
    y: {
      formatter: (value) => `${value} entry${value === 1 ? '' : 'ies'}`,
    },
  },
}))
</script>