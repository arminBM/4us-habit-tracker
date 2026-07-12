<template>
  <div class="space-y-5 pb-10 sm:space-y-6">
    <section>
      <h2 class="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
        Finance
      </h2>
      <p class="mt-1 text-sm text-secondary">
        Track your spending, income, budgets, and monthly progress.
      </p>
    </section>

    <section class="card flex items-center justify-between px-4 py-3">
  <!-- Previous -->
  <button
    @click="financeStore.goToPreviousMonth()"
    class="flex items-center justify-center rounded-xl border border-white/10 p-2 text-[#9CA3AF] transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-[0.95] active:bg-white/10"
  >
    <span class="h-5 w-5">
      <IconPrevious />
    </span>
  </button>

  <!-- Center -->
  <div class="text-center">
    <p class="text-xs text-[#9CA3AF]">Month</p>
    <p class="text-sm font-semibold text-white sm:text-base">
      {{ financeStore.selectedMonthLabel }}
    </p>
  </div>

  <!-- Next -->
  <button
    @click="financeStore.goToNextMonth()"
    :disabled="financeStore.isCurrentMonth"
    class="flex items-center justify-center rounded-xl border border-white/10 p-2 text-[#9CA3AF] transition-all duration-200 hover:bg-white/5 hover:text-white active:scale-[0.95] active:bg-white/10 disabled:opacity-40 disabled:active:scale-100"
  >
    <span class="h-5 w-5">
      <IconNext />
    </span>
  </button>
</section>

    <section class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div class="card-soft rounded-3xl p-4">
        <p class="metric-label">Today Expense</p>
        <p class="mt-2 text-xl metric-value sm:text-2xl">
          {{ todayExpense }}
        </p>
      </div>

      <div class="card-soft rounded-3xl p-4">
        <p class="metric-label">Month Expense</p>
        <p class="mt-2 text-xl metric-value sm:text-2xl">
          {{ monthExpense }}
        </p>
      </div>

      <div class="card-soft rounded-3xl p-4">
        <p class="metric-label">Month Income</p>
        <p class="mt-2 text-xl metric-value sm:text-2xl">
          {{ monthIncome }}
        </p>
      </div>

      <div class="card-soft rounded-3xl p-4">
  <p class="metric-label">Month Net</p>

  <div
    class="mt-2 flex items-center gap-2 text-xl font-semibold sm:text-2xl"
    :class="monthNetClass"
  >
    <span>{{ monthNet }}</span>
    <span class="h-5 w-5 shrink-0 sm:h-6 sm:w-6">
      <IconTrendingUp v-if="monthNetNumber >= 0" />
      <IconTrendingDown v-else />
    </span>
  </div>
</div>
    </section>

    <section class="card-soft rounded-3xl p-4">
  <div class="flex items-center justify-between mb-3">
    <p class="metric-label">Monthly Budget</p>

    <span
      class="text-sm font-medium"
      :class="isOverBudget ? 'text-red-400' : 'text-emerald-400'"
    >
      {{ isOverBudget
        ? `Over by ${formatAmount(Math.abs(remainingBudget))}`
        : `${formatAmount(remainingBudget)} left`
      }}
    </span>
  </div>

  <!-- numbers -->
  <div class="flex items-center justify-between text-sm mb-3">
    <span class="text-secondary">
      Budget: {{ formatAmount(financeStore.monthlyBudget) }}
    </span>

    <span class="text-secondary">
      Spent: {{ formatAmount(monthExpenseNumber) }}
    </span>
  </div>

  <!-- 🔥 progress bar -->
  <div class="h-2 w-full rounded-full bg-white/10 overflow-hidden">
    <div
      class="h-full transition-all duration-500"
      :class="isOverBudget ? 'bg-red-400' : 'bg-blue-400'"
      :style="{ width: budgetUsedPercent + '%' }"
    />
  </div>

  <p class="mt-2 text-xs text-secondary">
  {{ Math.round(budgetUsedPercent) }}% of budget used
</p>
</section>

    <section class="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
      <div class="card">
        <p class="metric-label">Finance Summary</p>
        <div class="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <p class="text-secondary">
            Total expense:
            <span class="font-medium text-primary">{{ totalExpense }}</span>
          </p>
          <p class="text-secondary">
            Total income:
            <span class="font-medium text-primary">{{ totalIncome }}</span>
          </p>
          <p class="text-secondary">
            Total net:
            <span :class="totalNetClass" class="font-medium">{{ totalNet }}</span>
          </p>
          <p class="text-secondary">
            Entries this month:
            <span class="font-medium text-primary">{{ entriesThisMonth }}</span>
          </p>
        </div>
      </div>

      <div class="card">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="metric-label">Budget</p>
            <p class="mt-2 text-xl metric-value sm:text-2xl">
              {{ budgetStatus }}
            </p>
            <!-- <p class="mt-1 text-xs text-secondary">{{ budgetStatusHint }}</p> -->
          </div>

          <div class="space-y-1 text-right text-xs text-secondary">
            <p>
              Today:
              <span :class="savedTodayClass" class="font-medium">{{ savedToday }}</span>
            </p>
            <p>
              Week:
              <span :class="savedWeekClass" class="font-medium">{{ savedWeek }}</span>
            </p>
            <p>
              Month:
              <span :class="savedMonthClass" class="font-medium">{{ savedMonth }}</span>
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="card p-4">
      <div class="mb-4 flex items-center justify-between gap-3">
        <div>
          <p class="panel-title">Budgets</p>
          <p class="panel-subtitle">Update your daily, weekly, and monthly limits</p>
        </div>
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10">
  <div class="flex items-center justify-between gap-4 px-4 py-4">
    <div>
      <p class="text-sm font-medium text-primary">Daily Budget</p>
      <p class="mt-1 text-xs text-secondary">Your daily spending limit</p>
    </div>

    <input
      v-model.number="financeStore.dailyBudget"
      type="number"
      min="0"
      class="w-28 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-primary outline-none placeholder:text-[#7C8591]"
      placeholder="20"
    />
  </div>

  <div class="flex items-center justify-between gap-4 px-4 py-4">
    <div>
      <p class="text-sm font-medium text-primary">Weekly Budget</p>
      <p class="mt-1 text-xs text-secondary">Your weekly spending limit</p>
    </div>

    <input
      v-model.number="financeStore.weeklyBudget"
      type="number"
      min="0"
      class="w-28 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-primary outline-none placeholder:text-[#7C8591]"
      placeholder="120"
    />
  </div>

  <div class="flex items-center justify-between gap-4 px-4 py-4">
    <div>
      <p class="text-sm font-medium text-primary">Monthly Budget</p>
      <p class="mt-1 text-xs text-secondary">Your monthly spending limit</p>
    </div>

    <input
      v-model.number="financeStore.monthlyBudget"
      type="number"
      min="0"
      class="w-28 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-primary outline-none placeholder:text-[#7C8591]"
      placeholder="500"
    />
  </div>
</div>
<div class="flex items-center justify-center mt-2">
  <section class="flex justify-center">
  <router-link
    to="/finance/budget-planner"
    class="inline-flex select-none items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-[#9CA3AF] transition-all duration-200 touch-manipulation hover:bg-white/10 hover:text-white active:scale-[0.96] active:bg-white/15 active:text-white"
  >
    <span>Plan Your Budget</span>

    <span class="h-4 w-4">
      <IconBudget />
    </span>
  </router-link>
</section>
  
</div>

    </section>

<section>
  <FinanceOverviewChart />
</section>

    <section class="flex justify-center">
  <router-link
    to="/finance/insights"
    class="inline-flex select-none items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-[#9CA3AF] transition-all duration-200 touch-manipulation hover:bg-white/10 hover:text-white active:scale-[0.96] active:bg-white/15 active:text-white"
  >
    <span>View Insights</span>

    <span class="h-4 w-4">
      <IconInsights />
    </span>
  </router-link>
</section>

    <section class="card">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="panel-title">Recent Entries</h3>
          <p class="panel-subtitle">Your latest finance logs</p>
        </div>

         <router-link
  to="/finance/history"
  class="shrink-0 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#9CA3AF] transition duration-200 hover:bg-white/10 hover:text-white active:scale-[0.97]"
>
  <span class="h-4 w-4">
    <IconHistory/>
  </span>
</router-link>
      </div>

      <div v-if="visibleEntries.length" class="mt-5 space-y-3">
        <div
          v-for="entry in visibleEntries"
          :key="entry.id"
          class="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
        >
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p
                class="text-base font-semibold"
                :class="(entry.entryKind || 'expense') === 'income' ? 'text-emerald-400' : 'text-primary'"
              >
                {{ (entry.entryKind || 'expense') === 'income' ? '+' : '-' }}{{ formatAmount(entry.value) }}
              </p>

              <span class="rounded-full bg-white/10 px-2 py-1 text-xs text-secondary">
                {{ (entry.entryKind || 'expense') === 'income' ? 'Income' : 'Expense' }}
              </span>
            </div>

            <p class="mt-2 text-sm text-secondary">
              {{ entry.category || 'Uncategorized' }}
            </p>

            <p class="mt-1 text-xs text-secondary">
              {{ entry.date }}
            </p>

            <p
              v-if="entry.note"
              class="mt-2 text-sm text-secondary"
            >
              {{ entry.note }}
            </p>
          </div>

          <button
  @click="handleDelete(entry.id)"
  class="shrink-0 flex items-center justify-center rounded-xl bg-red-500/10 p-2 text-red-400 transition-all duration-200 hover:bg-red-500/20 active:scale-[0.95]"
>
  <span class="h-4 w-4">
    <IconDelete />
  </span>
</button>
        </div>
      </div>

      <div
        v-else
        class="mt-6 flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-[#7C8591]"
      >
        No finance entries yet
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { getLocalDateKey, parseLocalDate, isSameDay } from '../utils/date'
import { useMonthlyEntries } from '../composables/useMonthlyEntries'
import FinanceOverviewChart from '../components/FinanceOverviewChart.vue'
import IconHistory from '../components/icons/IconHistory.vue'
import IconInsights from '../components/icons/IconInsights.vue'
import IconBudget from '../components/icons/IconBudget.vue'
import IconNext from '../components/icons/IconNext.vue'
import IconPrevious from '../components/icons/IconPrevious.vue'
import IconDelete from '../components/icons/IconDelete.vue'
import IconTrendingUp from '../components/icons/IconTrendingUp.vue'
import IconTrendingDown from '../components/icons/IconTrendingDown.vue'

const budgetUsedPercent = computed(() => {
  if (!financeStore.monthlyBudget) return 0

  return Math.min(
    (monthExpenseNumber.value / financeStore.monthlyBudget) * 100,
    100
  )
})

const remainingBudget = computed(() =>
  financeStore.monthlyBudget - monthExpenseNumber.value
)

const isOverBudget = computed(() =>
  remainingBudget.value < 0
)


const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

function formatAmount(value) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

function getStartOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + diff)
  return d
}

function getEndOfWeek(date) {
  const start = getStartOfWeek(date)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return end
}

const { typedEntries: financeEntries, monthEntries: monthFinanceEntries } =
  useMonthlyEntries('Finance')

const visibleEntries = computed(() => monthFinanceEntries.value.slice(0, 5))

const expenseEntries = computed(() =>
  financeEntries.value.filter(entry => (entry.entryKind || 'expense') === 'expense')
)

const incomeEntries = computed(() =>
  financeEntries.value.filter(entry => entry.entryKind === 'income')
)

const monthExpenseEntries = computed(() =>
  monthFinanceEntries.value.filter(entry => (entry.entryKind || 'expense') === 'expense')
)

const entriesThisMonth = computed(() => monthFinanceEntries.value.length)

const todayExpenseNumber = computed(() => {
  const todayKey = getLocalDateKey()

  return expenseEntries.value.reduce((sum, entry) => {
    return entry.date === todayKey ? sum + Number(entry.value) : sum
  }, 0)
})

const weekExpenseNumber = computed(() => {
  const now = new Date()
  const startOfWeek = getStartOfWeek(now)
  const endOfWeek = getEndOfWeek(now)

  return expenseEntries.value.reduce((sum, entry) => {
    const entryDate = parseLocalDate(entry.date)
    return entryDate >= startOfWeek && entryDate <= endOfWeek
      ? sum + Number(entry.value)
      : sum
  }, 0)
})

const monthExpenseNumber = computed(() =>
  monthExpenseEntries.value.reduce((sum, entry) => sum + Number(entry.value), 0)
)

const totalExpenseNumber = computed(() =>
  expenseEntries.value.reduce((sum, entry) => sum + Number(entry.value), 0)
)

const monthIncomeNumber = computed(() => {
  return incomeEntries.value.reduce((sum, entry) => {
    const entryDate = parseLocalDate(entry.date)

    const sameMonth =
      entryDate.getFullYear() === financeStore.selectedYear &&
      entryDate.getMonth() === financeStore.selectedMonth

    return sameMonth ? sum + Number(entry.value) : sum
  }, 0)
})

const totalIncomeNumber = computed(() =>
  incomeEntries.value.reduce((sum, entry) => sum + Number(entry.value), 0)
)

const todayIncomeNumber = computed(() => {
  const today = new Date()

  return incomeEntries.value.reduce((sum, entry) => {
    const entryDate = parseLocalDate(entry.date)
    return isSameDay(entryDate, today) ? sum + Number(entry.value) : sum
  }, 0)
})

const monthNetNumber = computed(() =>
  monthIncomeNumber.value - monthExpenseNumber.value
)

const totalNetNumber = computed(() =>
  totalIncomeNumber.value - totalExpenseNumber.value
)

const todayExpense = computed(() => formatAmount(todayExpenseNumber.value))
const monthExpense = computed(() => formatAmount(monthExpenseNumber.value))
const monthIncome = computed(() => formatAmount(monthIncomeNumber.value))
const totalExpense = computed(() => formatAmount(totalExpenseNumber.value))
const totalIncome = computed(() => formatAmount(totalIncomeNumber.value))
const totalNet = computed(() => formatAmount(totalNetNumber.value))
const monthNet = computed(() => formatAmount(monthNetNumber.value))

const savedTodayNumber = computed(() =>
  financeStore.dailyBudget - todayExpenseNumber.value
)
const savedWeekNumber = computed(() =>
  financeStore.weeklyBudget - weekExpenseNumber.value
)
const savedMonthNumber = computed(() =>
  financeStore.monthlyBudget - monthExpenseNumber.value
)

const savedToday = computed(() => formatAmount(savedTodayNumber.value))
const savedWeek = computed(() => formatAmount(savedWeekNumber.value))
const savedMonth = computed(() => formatAmount(savedMonthNumber.value))

const savedTodayClass = computed(() =>
  savedTodayNumber.value >= 0 ? 'text-emerald-400' : 'text-red-400'
)

const savedWeekClass = computed(() =>
  savedWeekNumber.value >= 0 ? 'text-emerald-400' : 'text-red-400'
)

const savedMonthClass = computed(() =>
  savedMonthNumber.value >= 0 ? 'text-emerald-400' : 'text-red-400'
)

const monthNetClass = computed(() =>
  monthNetNumber.value >= 0 ? 'text-emerald-400' : 'text-red-400'
)

const totalNetClass = computed(() =>
  totalNetNumber.value >= 0 ? 'text-emerald-400' : 'text-red-400'
)

const budgetStatus = computed(() => {
  if (savedMonthNumber.value >= 0) return 'On track'
  if (savedWeekNumber.value >= 0) return 'Watch spending'
  return 'Over budget'
})

const budgetStatusHint = computed(() => {
  if (savedMonthNumber.value >= 0) {
    return 'Your monthly budget is still in a healthy range.'
  }

  if (savedWeekNumber.value >= 0) {
    return 'You are still okay this week, but the month is getting tight.'
  }

  return 'Your current spending is above your planned budget.'
})

function handleDelete(id) {
  if (!confirm('Delete this entry?')) return
  entriesStore.deleteEntry(id)
}
</script>