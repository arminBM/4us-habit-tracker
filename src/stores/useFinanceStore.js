import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useFinanceStore = defineStore('finance', () => {
  const dailyBudget = ref(0)
  const weeklyBudget = ref(0)
  const monthlyBudget = ref(0)

  // Planner state
  const plannerMonthlyIncome = ref(0)
  const plannerRent = ref(0)
  const plannerBills = ref(0)
  const plannerTransport = ref(0)
  const plannerGroceries = ref(0)
  const plannerDebt = ref(0)
  const plannerOther = ref(0)
  const plannerGoalMode = ref('amount')
  const plannerGoalValue = ref(200)
  const plannerStyleMode = ref('balanced')

  const now = new Date()
  const selectedYear = ref(now.getFullYear())
  const selectedMonth = ref(now.getMonth()) // 0-based

  function loadBudgets() {
    const saved = localStorage.getItem('life-tracker-finance-budgets')
    if (!saved) return

    try {
      const parsed = JSON.parse(saved)

      dailyBudget.value = Number(parsed.dailyBudget || 0)
      weeklyBudget.value = Number(parsed.weeklyBudget || 0)
      monthlyBudget.value = Number(parsed.monthlyBudget || 0)

      plannerMonthlyIncome.value = Number(parsed.plannerMonthlyIncome || 0)
      plannerRent.value = Number(parsed.plannerRent || 0)
      plannerBills.value = Number(parsed.plannerBills || 0)
      plannerTransport.value = Number(parsed.plannerTransport || 0)
      plannerGroceries.value = Number(parsed.plannerGroceries || 0)
      plannerDebt.value = Number(parsed.plannerDebt || 0)
      plannerOther.value = Number(parsed.plannerOther || 0)
      plannerGoalMode.value = parsed.plannerGoalMode || 'amount'
      plannerGoalValue.value = Number(parsed.plannerGoalValue || 200)
      plannerStyleMode.value = parsed.plannerStyleMode || 'balanced'
    } catch (error) {
      console.error('Failed to load finance budgets', error)
    }
  }

  function replaceBudgets(newBudgets = {}) {
    dailyBudget.value = Number(newBudgets.dailyBudget || 0)
    weeklyBudget.value = Number(newBudgets.weeklyBudget || 0)
    monthlyBudget.value = Number(newBudgets.monthlyBudget || 0)
  }

  function resetPlanner() {
    plannerMonthlyIncome.value = 0
    plannerRent.value = 0
    plannerBills.value = 0
    plannerTransport.value = 0
    plannerGroceries.value = 0
    plannerDebt.value = 0
    plannerOther.value = 0
    plannerGoalMode.value = 'amount'
    plannerGoalValue.value = 200
    plannerStyleMode.value = 'balanced'
  }

  const selectedMonthLabel = computed(() => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(selectedYear.value, selectedMonth.value, 1))
  })

  const isCurrentMonth = computed(() => {
    const today = new Date()
    return (
      selectedYear.value === today.getFullYear() &&
      selectedMonth.value === today.getMonth()
    )
  })

  function goToPreviousMonth() {
    if (selectedMonth.value === 0) {
      selectedMonth.value = 11
      selectedYear.value -= 1
    } else {
      selectedMonth.value -= 1
    }
  }

  function goToNextMonth() {
    if (isCurrentMonth.value) return

    if (selectedMonth.value === 11) {
      selectedMonth.value = 0
      selectedYear.value += 1
    } else {
      selectedMonth.value += 1
    }
  }

  function resetToCurrentMonth() {
    const today = new Date()
    selectedYear.value = today.getFullYear()
    selectedMonth.value = today.getMonth()
  }

  watch(
    [
      dailyBudget,
      weeklyBudget,
      monthlyBudget,
      plannerMonthlyIncome,
      plannerRent,
      plannerBills,
      plannerTransport,
      plannerGroceries,
      plannerDebt,
      plannerOther,
      plannerGoalMode,
      plannerGoalValue,
      plannerStyleMode,
    ],
    () => {
      localStorage.setItem(
        'life-tracker-finance-budgets',
        JSON.stringify({
          dailyBudget: dailyBudget.value,
          weeklyBudget: weeklyBudget.value,
          monthlyBudget: monthlyBudget.value,

          plannerMonthlyIncome: plannerMonthlyIncome.value,
          plannerRent: plannerRent.value,
          plannerBills: plannerBills.value,
          plannerTransport: plannerTransport.value,
          plannerGroceries: plannerGroceries.value,
          plannerDebt: plannerDebt.value,
          plannerOther: plannerOther.value,
          plannerGoalMode: plannerGoalMode.value,
          plannerGoalValue: plannerGoalValue.value,
          plannerStyleMode: plannerStyleMode.value,
        })
      )
    },
    { deep: true }
  )

  return {
    dailyBudget,
    weeklyBudget,
    monthlyBudget,
    loadBudgets,
    replaceBudgets,

    plannerMonthlyIncome,
    plannerRent,
    plannerBills,
    plannerTransport,
    plannerGroceries,
    plannerDebt,
    plannerOther,
    plannerGoalMode,
    plannerGoalValue,
    plannerStyleMode,
    resetPlanner,

    selectedYear,
    selectedMonth,
    selectedMonthLabel,
    isCurrentMonth,
    goToPreviousMonth,
    goToNextMonth,
    resetToCurrentMonth,
  }
})