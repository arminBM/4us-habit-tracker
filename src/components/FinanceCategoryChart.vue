<template>
  <div class="card p-4 sm:p-5">
    <div class="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold text-primary">Expenses by Category</h3>
        <p class="text-sm text-secondary">See where your money goes</p>
      </div>

      <div class="flex gap-2">
        <button
          @click="scope = 'month'"
          :class="chipClass(scope === 'month')"
        >
          This Month
        </button>

        <button
          @click="scope = 'all'"
          :class="chipClass(scope === 'all')"
        >
          All Time
        </button>
      </div>
    </div>

    <div v-if="series.length" class="min-h-80">
      <apexchart
        type="donut"
        :height="chartHeight"
        :options="chartOptions"
        :series="series"
      />
    </div>

    <div
      v-else
      class="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-[#7C8591]"
    >
      No category data yet
    </div>

   <div v-if="sortedCategoryTotals.length" class="mt-6 space-y-4">

  <!-- Top / Low summary -->
  <div class="grid grid-cols-2 gap-3">

    <!-- Top -->
    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p class="text-xs text-red-400">Top Category</p>
      <p class="mt-1 text-sm font-semibold text-red-400">
        {{ highestCategory.category }}
      </p>
      <p class="mt-1 text-xs text-[#9CA3AF]">
        {{ formatAmount(highestCategory.total) }}
      </p>
    </div>

    <!-- Lowest -->
    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p class="text-xs text-emerald-400">Lowest Category</p>
      <p class="mt-1 text-sm font-semibold text-emerald-400">
        {{ lowestCategory.category }}
      </p>
      <p class="mt-1 text-xs text-[#9CA3AF]">
        {{ formatAmount(lowestCategory.total) }}
      </p>
    </div>

  </div>

  <!-- History button -->
  <div class="flex justify-center">
    <router-link
      to="/finance/history"
      class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-primary transition hover:bg-white/10"
    >
      View History →
    </router-link>
  </div>

</div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { parseLocalDate } from '../utils/date'

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

const scope = ref('month')

const isInsightsPage =
  typeof window !== 'undefined' &&
  window.location.pathname.includes('/finance/insights')

function chipClass(active) {
  return [
    'whitespace-nowrap rounded-xl px-3 py-2 text-xs transition',
    active
      ? 'bg-white/10 text-[#E6E8EB]'
      : 'text-[#9CA3AF] hover:bg-white/5',
  ]
}

function formatAmount(value) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value)
}

function amountClass(item) {
  if (highestCategory.value && item.category === highestCategory.value.category) {
    return 'text-emerald-400'
  }

  if (lowestCategory.value && item.category === lowestCategory.value.category) {
    return 'text-amber-300'
  }

  return 'text-[#E6E8EB]'
}

const chartHeight = computed(() => {
  if (typeof window !== 'undefined') {
    if (isInsightsPage) {
      if (window.innerWidth < 640) return 360
      if (window.innerWidth < 1024) return 400
      return 440
    }

    if (window.innerWidth < 640) return 300
    if (window.innerWidth < 1024) return 320
  }

  return 320
})

const financeEntries = computed(() =>
  entriesStore.entries.filter(entry => entry.type === 'Finance')
)

const expenseEntries = computed(() =>
  financeEntries.value.filter(entry => (entry.entryKind || 'expense') === 'expense')
)

const scopedExpenseEntries = computed(() => {
  if (scope.value === 'all') return expenseEntries.value

  return expenseEntries.value.filter(entry => {
    const entryDate = parseLocalDate(entry.date)

    return (
      entryDate.getFullYear() === financeStore.selectedYear &&
      entryDate.getMonth() === financeStore.selectedMonth
    )
  })
})

const categoryTotals = computed(() => {
  const map = {}

  for (const entry of scopedExpenseEntries.value) {
    const category = entry.category?.trim() || 'Uncategorized'

    if (!map[category]) {
      map[category] = {
        category,
        total: 0,
        count: 0,
      }
    }

    map[category].total += Number(entry.value)
    map[category].count += 1
  }

  return Object.values(map)
})

const sortedCategoryTotals = computed(() =>
  [...categoryTotals.value].sort((a, b) => b.total - a.total)
)

const highestCategory = computed(() =>
  sortedCategoryTotals.value.length ? sortedCategoryTotals.value[0] : null
)

const lowestCategory = computed(() =>
  sortedCategoryTotals.value.length
    ? sortedCategoryTotals.value[sortedCategoryTotals.value.length - 1]
    : null
)

const labels = computed(() =>
  sortedCategoryTotals.value.map(item => item.category)
)

const series = computed(() =>
  sortedCategoryTotals.value.map(item => item.total)
)

const chartOptions = computed(() => ({
  chart: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
    toolbar: {
      show: false,
    },
    background: 'transparent',
  },
  theme: {
    mode: 'dark',
  },
  labels: labels.value,
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
  stroke: {
    width: 0,
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '12px',
      fontWeight: 600,
    },
    dropShadow: {
      enabled: false,
    },
    formatter: value => `${Math.round(value)}%`,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          name: {
            show: true,
            color: '#9CA3AF',
            fontSize: '13px',
            offsetY: 18,
          },
          value: {
            show: true,
            color: '#E6E8EB',
            fontSize: '22px',
            fontWeight: 700,
            offsetY: -10,
            formatter: value => formatAmount(value),
          },
          total: {
            show: true,
            showAlways: true,
            label: scope.value === 'all' ? 'All Time' : 'This Month',
            color: '#9CA3AF',
            fontSize: '13px',
            formatter: () =>
              formatAmount(
                series.value.reduce((sum, value) => sum + Number(value), 0)
              ),
          },
        },
      },
    },
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: value => formatAmount(value),
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
      filter: {
        type: 'none',
        value: 0,
      },
    },
  },
}))
</script>