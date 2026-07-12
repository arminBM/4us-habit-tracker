<template>
  <div class="space-y-6 pb-10 sm:space-y-7">
    <section>
      <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Settings
      </h2>
      <p class="mt-1 text-sm text-[#9CA3AF]">
        Backup and restore your entries, budgets, and planner data.
      </p>
    </section>

    <section class="grid gap-4 sm:grid-cols-2">
      <div class="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <div class="flex items-start gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#E6E8EB]">
            <span class="h-5 w-5">
              <IconExportImage />
            </span>
          </div>

          <div class="min-w-0">
            <h3 class="text-lg font-semibold text-white">Export Data</h3>
            <p class="mt-1 text-sm text-[#9CA3AF]">
              Download your entries, budgets, and planner setup in one backup file.
            </p>
          </div>
        </div>

        <button
          @click="handleExport"
          class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-white/90 active:scale-[0.98]"
        >
          <span class="h-4 w-4">
            <IconExportImage />
          </span>
          Export Backup
        </button>
      </div>

      <div class="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
        <div class="flex items-start gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#E6E8EB]">
            <span class="h-5 w-5">
              <IconImport />
            </span>
          </div>

          <div class="min-w-0">
            <h3 class="text-lg font-semibold text-white">Import Data</h3>
            <p class="mt-1 text-sm text-[#9CA3AF]">
              Restore your entries, budgets, and planner setup from a backup file.
            </p>
          </div>
        </div>

        <label
          class="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-[#E6E8EB] transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
        >
          <span class="h-4 w-4">
            <IconImport />
          </span>
          Choose Backup File
          <input
            type="file"
            accept="application/json"
            @change="handleImport"
            class="hidden"
          />
        </label>

        <p class="mt-3 text-xs text-[#7C8591]">
          Importing will replace your current entries, budgets, and planner values.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useEntriesStore } from '../stores/useEntriesStore'
import { useFinanceStore } from '../stores/useFinanceStore'
import { exportData, importData } from '../utils/backup'
import IconImport from '../components/icons/IconImport.vue'
import IconExportImage from '../components/icons/IconExportImage.vue'

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

function handleExport() {
  exportData({
    entries: entriesStore.entries,
    financeBudgets: {
      dailyBudget: financeStore.dailyBudget,
      weeklyBudget: financeStore.weeklyBudget,
      monthlyBudget: financeStore.monthlyBudget,

      plannerMonthlyIncome: financeStore.plannerMonthlyIncome,
      plannerRent: financeStore.plannerRent,
      plannerBills: financeStore.plannerBills,
      plannerTransport: financeStore.plannerTransport,
      plannerGroceries: financeStore.plannerGroceries,
      plannerDebt: financeStore.plannerDebt,
      plannerOther: financeStore.plannerOther,

      plannerGoalMode: financeStore.plannerGoalMode,
      plannerGoalValue: financeStore.plannerGoalValue,
      plannerStyleMode: financeStore.plannerStyleMode,
    },
  })
}

async function handleImport(event) {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const data = await importData(file)

    const isOldFormat = Array.isArray(data)
    const isNewFormat =
      data &&
      typeof data === 'object' &&
      Array.isArray(data.entries)

    if (!isOldFormat && !isNewFormat) {
      alert('Invalid backup file')
      return
    }

    const confirmReplace = confirm(
      'This will replace your current entries, budgets, and planner values. Continue?'
    )

    if (!confirmReplace) return

    if (isOldFormat) {
      await entriesStore.replaceAllEntries(data)

      financeStore.replaceBudgets({
        dailyBudget: 0,
        weeklyBudget: 0,
        monthlyBudget: 0,
      })

      financeStore.resetPlanner()
    } else {
      await entriesStore.replaceAllEntries(data.entries)

      const financeBudgets = data.financeBudgets || {}

      financeStore.replaceBudgets(financeBudgets)

      financeStore.plannerMonthlyIncome = Number(financeBudgets.plannerMonthlyIncome || 0)
      financeStore.plannerRent = Number(financeBudgets.plannerRent || 0)
      financeStore.plannerBills = Number(financeBudgets.plannerBills || 0)
      financeStore.plannerTransport = Number(financeBudgets.plannerTransport || 0)
      financeStore.plannerGroceries = Number(financeBudgets.plannerGroceries || 0)
      financeStore.plannerDebt = Number(financeBudgets.plannerDebt || 0)
      financeStore.plannerOther = Number(financeBudgets.plannerOther || 0)

      financeStore.plannerGoalMode =
        financeBudgets.plannerGoalMode === 'percent' ? 'percent' : 'amount'

      financeStore.plannerGoalValue = Number(financeBudgets.plannerGoalValue || 200)

      financeStore.plannerStyleMode = ['conservative', 'balanced', 'flexible'].includes(
        financeBudgets.plannerStyleMode
      )
        ? financeBudgets.plannerStyleMode
        : 'balanced'
    }

    alert('Data imported successfully')
  } catch (err) {
    alert('Failed to import file')
  }

  event.target.value = ''
}
</script>