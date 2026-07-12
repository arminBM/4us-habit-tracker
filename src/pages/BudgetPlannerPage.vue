<template>
  <div class="min-h-screen bg-[#0B0C10] text-[#E6E8EB]">
    <header class="sticky top-0 z-30 border-b border-white/10 bg-[#0B0C10]/90 backdrop-blur-xl">
      <div class="flex items-center justify-between px-4 py-4">
        <button
  @click="$router.back()"
  class="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-[#9CA3AF] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-[0.95]"
>
  <span class="h-5 w-5">
    <IconBack />
  </span>
</button>

        <h2 class="text-base font-semibold">Budget Planner</h2>

        <div class="w-[50px]" />
      </div>
    </header>

    <main class="space-y-5 px-4 py-4 pb-24">
      <section class="rounded-3xl border border-white/10 bg-white/5 p-4">
        <h3 class="text-lg font-semibold text-[#E6E8EB]">Your Income</h3>
        <p class="mt-1 text-sm text-[#9CA3AF]">
          Enter your monthly income.
        </p>

        <div class="mt-4">
          <label class="mb-2 block text-sm text-[#9CA3AF]">Monthly Income</label>
          <input
            v-model.number="monthlyIncome"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#E6E8EB] outline-none placeholder:text-[#7C8591]"
            placeholder="e.g. 1500"
          />
        </div>
      </section>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-4">
        <h3 class="text-lg font-semibold text-[#E6E8EB]">Essential Monthly Costs</h3>
        <p class="mt-1 text-sm text-[#9CA3AF]">
          Add your unavoidable monthly expenses.
        </p>

        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm text-[#9CA3AF]">Rent</label>
            <input
              v-model.number="rent"
              type="number"
              min="0"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#E6E8EB] outline-none placeholder:text-[#7C8591]"
              placeholder="0"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm text-[#9CA3AF]">Bills</label>
            <input
              v-model.number="bills"
              type="number"
              min="0"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#E6E8EB] outline-none placeholder:text-[#7C8591]"
              placeholder="0"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm text-[#9CA3AF]">Transport</label>
            <input
              v-model.number="transport"
              type="number"
              min="0"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#E6E8EB] outline-none placeholder:text-[#7C8591]"
              placeholder="0"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm text-[#9CA3AF]">Groceries</label>
            <input
              v-model.number="groceries"
              type="number"
              min="0"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#E6E8EB] outline-none placeholder:text-[#7C8591]"
              placeholder="0"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm text-[#9CA3AF]">Debt</label>
            <input
              v-model.number="debt"
              type="number"
              min="0"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#E6E8EB] outline-none placeholder:text-[#7C8591]"
              placeholder="0"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm text-[#9CA3AF]">Other</label>
            <input
              v-model.number="other"
              type="number"
              min="0"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#E6E8EB] outline-none placeholder:text-[#7C8591]"
              placeholder="0"
            />
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-4">
        <h3 class="text-lg font-semibold text-[#E6E8EB]">Savings Goal</h3>
        <p class="mt-1 text-sm text-[#9CA3AF]">
          Choose whether you want to save a fixed amount or a percentage.
        </p>

        <div class="mt-4 flex gap-2">
          <button
            @click="goalMode = 'amount'"
            :class="chipClass(goalMode === 'amount')"
          >
            Amount
          </button>

          <button
            @click="goalMode = 'percent'"
            :class="chipClass(goalMode === 'percent')"
          >
            Percentage
          </button>
        </div>

        <div class="mt-4">
          <label class="mb-2 block text-sm text-[#9CA3AF]">
            {{ goalMode === 'amount' ? 'Monthly Savings Target' : 'Savings Percentage' }}
          </label>

          <input
            v-model.number="goalValue"
            type="number"
            min="0"
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#E6E8EB] outline-none placeholder:text-[#7C8591]"
            :placeholder="goalMode === 'amount' ? 'e.g. 200' : 'e.g. 20'"
          />
        </div>
      </section>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-4">
        <h3 class="text-lg font-semibold text-[#E6E8EB]">Spending Style</h3>
        <p class="mt-1 text-sm text-[#9CA3AF]">
          This adjusts how strict or flexible the plan should be.
        </p>

        <div class="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            @click="styleMode = 'conservative'"
            :class="chipClass(styleMode === 'conservative')"
          >
            Conservative
          </button>

          <button
            @click="styleMode = 'balanced'"
            :class="chipClass(styleMode === 'balanced')"
          >
            Balanced
          </button>

          <button
            @click="styleMode = 'flexible'"
            :class="chipClass(styleMode === 'flexible')"
          >
            Flexible
          </button>
        </div>
      </section>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-4">
  <h3 class="text-lg font-semibold text-[#E6E8EB]">Results</h3>
  <p class="mt-1 text-sm text-[#9CA3AF]">
    Here is the flow of your money and the recommended budget.
  </p>

  <!-- Flow summary -->
  <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p class="text-xs text-[#9CA3AF]">Income</p>
      <p class="mt-2 text-lg font-semibold text-[#E6E8EB]">
        {{ formatAmount(monthlyIncome) }}
      </p>
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p class="text-xs text-[#9CA3AF]">Essentials</p>
      <p class="mt-2 text-lg font-semibold text-red-300">
        {{ formatAmount(totalEssentials) }}
      </p>
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p class="text-xs text-[#9CA3AF]">Savings Target</p>
      <p class="mt-2 text-lg font-semibold text-emerald-400">
        {{ formatAmount(adjustedSavingsTarget) }}
      </p>
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p class="text-xs text-[#9CA3AF]">Flexible Budget</p>
      <p class="mt-2 text-lg font-semibold text-[#E6E8EB]">
        {{ formatAmount(safeFlexibleBudget) }}
      </p>
    </div>
  </div>

  <!-- Visual allocation -->
  <div class="mt-5">
    <div class="mb-2 flex items-center justify-between text-xs text-[#9CA3AF]">
      <span>How your income is allocated</span>
      <span>{{ monthlyIncome > 0 ? '100%' : '—' }}</span>
    </div>

    <div class="h-3 w-full overflow-hidden rounded-full bg-white/10">
      <div class="flex h-full w-full">
        <div
          class="bg-red-400/80 transition-all duration-500"
          :style="{ width: `${essentialsPercent}%` }"
        />
        <div
          class="bg-emerald-400/80 transition-all duration-500"
          :style="{ width: `${savingsPercent}%` }"
        />
        <div
          class="bg-blue-400/80 transition-all duration-500"
          :style="{ width: `${flexiblePercent}%` }"
        />
      </div>
    </div>

    <div class="mt-3 grid gap-2 text-xs text-[#9CA3AF] sm:grid-cols-3">
      <div class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span>Essentials</span>
        <span class="ml-auto">{{ Math.round(essentialsPercent) }}%</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span>Savings</span>
        <span class="ml-auto">{{ Math.round(savingsPercent) }}%</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full bg-blue-400/80" />
        <span>Flexible</span>
        <span class="ml-auto">{{ Math.round(flexiblePercent) }}%</span>
      </div>
    </div>
  </div>

  <!-- Recommended budgets -->
  <div class="mt-5">
    <p class="text-sm font-medium text-[#E6E8EB]">Recommended Budget Limits</p>

    <div class="mt-3 grid grid-cols-3 gap-3">
      <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p class="text-xs text-[#9CA3AF]">Daily</p>
        <p class="mt-1 text-sm font-semibold text-[#E6E8EB]">
          {{ formatAmount(recommendedDailyBudget) }}
        </p>
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p class="text-xs text-[#9CA3AF]">Weekly</p>
        <p class="mt-1 text-sm font-semibold text-[#E6E8EB]">
          {{ formatAmount(recommendedWeeklyBudget) }}
        </p>
      </div>

      <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
        <p class="text-xs text-[#9CA3AF]">Monthly</p>
        <p class="mt-1 text-sm font-semibold text-[#E6E8EB]">
          {{ formatAmount(recommendedMonthlyBudget) }}
        </p>
      </div>
    </div>
  </div>

  <!-- Status -->
  <div class="mt-5 grid gap-3 sm:grid-cols-2">
    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p class="text-sm text-[#9CA3AF]">Plan Status</p>
      <p class="mt-2 text-lg font-semibold" :class="statusClass">
        {{ planStatus }}
      </p>
      <p class="mt-1 text-xs text-[#9CA3AF]">
        {{ statusHint }}
      </p>
    </div>

    <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p class="text-sm text-[#9CA3AF]">What gets applied</p>
      <p class="mt-2 text-sm text-[#E6E8EB]">
        Daily, weekly, and monthly finance budgets in your Finance page.
      </p>
      <p class="mt-2 text-xs text-[#9CA3AF]">
        Press “Apply Budgets” to replace your current limits.
      </p>
    </div>
  </div>

  <div
    v-if="warningMessage"
    class="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
  >
    {{ warningMessage }}
  </div>

  <div class="mt-5 grid grid-cols-2 gap-3">
    <button
      @click="applyBudgets"
      :disabled="!canApply"
      class="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Apply Budgets
    </button>

    <button
      @click="resetBudgets"
      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-[#9CA3AF] transition hover:bg-white/10"
    >
      Reset Budgets
    </button>
  </div>
</section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFinanceStore } from '../stores/useFinanceStore'
import IconBack from '../components/icons/IconBack.vue'

const financeStore = useFinanceStore()

function resetBudgets() {
  const confirmed = confirm('Clear your current finance budgets and planner values?')
  if (!confirmed) return

  financeStore.dailyBudget = 0
  financeStore.weeklyBudget = 0
  financeStore.monthlyBudget = 0
  financeStore.resetPlanner()

  alert('Budgets and planner values reset.')
}

function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

const selectedMonthDays = computed(() =>
  getDaysInMonth(financeStore.selectedYear, financeStore.selectedMonth)
)

// Planner fields are now stored in financeStore
const monthlyIncome = computed({
  get: () => financeStore.plannerMonthlyIncome,
  set: value => {
    financeStore.plannerMonthlyIncome = Number(value || 0)
  },
})

const rent = computed({
  get: () => financeStore.plannerRent,
  set: value => {
    financeStore.plannerRent = Number(value || 0)
  },
})

const bills = computed({
  get: () => financeStore.plannerBills,
  set: value => {
    financeStore.plannerBills = Number(value || 0)
  },
})

const transport = computed({
  get: () => financeStore.plannerTransport,
  set: value => {
    financeStore.plannerTransport = Number(value || 0)
  },
})

const groceries = computed({
  get: () => financeStore.plannerGroceries,
  set: value => {
    financeStore.plannerGroceries = Number(value || 0)
  },
})

const debt = computed({
  get: () => financeStore.plannerDebt,
  set: value => {
    financeStore.plannerDebt = Number(value || 0)
  },
})

const other = computed({
  get: () => financeStore.plannerOther,
  set: value => {
    financeStore.plannerOther = Number(value || 0)
  },
})

const goalMode = computed({
  get: () => financeStore.plannerGoalMode,
  set: value => {
    financeStore.plannerGoalMode = value
  },
})

const goalValue = computed({
  get: () => financeStore.plannerGoalValue,
  set: value => {
    financeStore.plannerGoalValue = Number(value || 0)
  },
})

const styleMode = computed({
  get: () => financeStore.plannerStyleMode,
  set: value => {
    financeStore.plannerStyleMode = value
  },
})

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
  }).format(Math.max(0, Number(value) || 0))
}

const totalEssentials = computed(() =>
  Number(rent.value || 0) +
  Number(bills.value || 0) +
  Number(transport.value || 0) +
  Number(groceries.value || 0) +
  Number(debt.value || 0) +
  Number(other.value || 0)
)

const netAvailable = computed(() =>
  Math.max(0, Number(monthlyIncome.value || 0) - totalEssentials.value)
)

const baseSavingsTarget = computed(() => {
  const income = Number(monthlyIncome.value || 0)
  const goal = Number(goalValue.value || 0)

  if (goalMode.value === 'percent') {
    return income * (goal / 100)
  }

  return goal
})

const savingsMultiplier = computed(() => {
  if (styleMode.value === 'conservative') return 1.2
  if (styleMode.value === 'flexible') return 0.8
  return 1
})

const adjustedSavingsTarget = computed(() =>
  Math.max(0, baseSavingsTarget.value * savingsMultiplier.value)
)

const flexibleBudget = computed(() =>
  netAvailable.value - adjustedSavingsTarget.value
)

const safeFlexibleBudget = computed(() =>
  Math.max(0, flexibleBudget.value)
)

const recommendedMonthlyBudget = computed(() =>
  Math.round(safeFlexibleBudget.value * 100) / 100
)

const recommendedWeeklyBudget = computed(() =>
  Math.round((safeFlexibleBudget.value / 4) * 100) / 100
)

const recommendedDailyBudget = computed(() =>
  Math.round((safeFlexibleBudget.value / selectedMonthDays.value) * 100) / 100
)

const planStatus = computed(() => {
  if (Number(monthlyIncome.value || 0) <= 0) return 'Incomplete'
  if (totalEssentials.value > Number(monthlyIncome.value || 0)) return 'Risky'
  if (flexibleBudget.value < 0) return 'Too Tight'
  if (safeFlexibleBudget.value < Number(monthlyIncome.value || 0) * 0.1) return 'Tight'
  return 'Comfortable'
})

const statusClass = computed(() => {
  if (planStatus.value === 'Comfortable') return 'text-emerald-400'
  if (planStatus.value === 'Tight') return 'text-amber-300'
  if (planStatus.value === 'Incomplete') return 'text-[#E6E8EB]'
  return 'text-red-400'
})

const statusHint = computed(() => {
  if (planStatus.value === 'Incomplete') {
    return 'Add income and costs to get a useful recommendation.'
  }

  if (planStatus.value === 'Risky') {
    return 'Your essential costs are higher than your income.'
  }

  if (planStatus.value === 'Too Tight') {
    return 'Your current savings goal is too aggressive for this budget.'
  }

  if (planStatus.value === 'Tight') {
    return 'This plan is possible, but leaves little room for extra spending.'
  }

  return 'This budget plan leaves reasonable room for flexible spending.'
})

const warningMessage = computed(() => {
  if (Number(monthlyIncome.value || 0) <= 0) return ''

  if (totalEssentials.value > Number(monthlyIncome.value || 0)) {
    return 'Your essential monthly costs exceed your income. Reduce costs or increase income before applying a budget.'
  }

  if (flexibleBudget.value < 0) {
    return 'Your savings target is too high for your current income and essential costs.'
  }

  return ''
})

const canApply = computed(() => {
  return (
    Number(monthlyIncome.value || 0) > 0 &&
    totalEssentials.value <= Number(monthlyIncome.value || 0) &&
    flexibleBudget.value >= 0
  )
})

function applyBudgets() {
  if (!canApply.value) return

  const confirmed = confirm('Replace your current finance budgets with these recommended values?')
  if (!confirmed) return

  financeStore.dailyBudget = Math.round(recommendedDailyBudget.value * 100) / 100
  financeStore.weeklyBudget = Math.round(recommendedWeeklyBudget.value * 100) / 100
  financeStore.monthlyBudget = Math.round(recommendedMonthlyBudget.value * 100) / 100

  alert('Recommended budgets applied.')
}

const essentialsPercent = computed(() => {
  const income = Number(monthlyIncome.value || 0)
  if (income <= 0) return 0
  return Math.min((totalEssentials.value / income) * 100, 100)
})

const savingsPercent = computed(() => {
  const income = Number(monthlyIncome.value || 0)
  if (income <= 0) return 0
  return Math.min((adjustedSavingsTarget.value / income) * 100, 100)
})

const flexiblePercent = computed(() => {
  const income = Number(monthlyIncome.value || 0)
  if (income <= 0) return 0
  return Math.min((safeFlexibleBudget.value / income) * 100, 100)
})
</script>