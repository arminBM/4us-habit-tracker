<template>
  <div class="fixed inset-0 flex flex-col bg-[#0B0C10] text-[#E6E8EB]">
    <header class="shrink-0 border-b border-white/10 bg-[#0B0C10]/90 backdrop-blur-xl">
      <div class="flex items-center justify-between gap-2 px-3 py-4 sm:px-4">
        <button
  @click="$router.back()"
  class="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-[#9CA3AF] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-[0.95]"
>
  <span class="h-5 w-5">
    <IconBack />
  </span>
</button>

        <div class="text-center">
          <p class="text-sm text-[#9CA3AF]">Finance Insights</p>
          <p class="text-lg font-semibold text-[#E6E8EB]">
            {{ financeStore.selectedMonthLabel }}
          </p>
        </div>

        <div class="w-16" />
      </div>

      <div class="px-3 pb-3 sm:px-4">
        <div class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <button
            @click="handlePrevMonth"
            class="rounded-xl px-3 py-2 text-sm font-medium text-[#9CA3AF] transition hover:bg-white/10 hover:text-[#E6E8EB]"
          >
            ← Prev
          </button>

          <p class="text-sm font-medium text-[#E6E8EB]">
            {{ financeStore.selectedMonthLabel }}
          </p>

          <button
            @click="handleNextMonth"
            :disabled="financeStore.isCurrentMonth"
            class="rounded-xl px-3 py-2 text-sm font-medium text-[#9CA3AF] transition hover:bg-white/10 hover:text-[#E6E8EB] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>

        <div class="mt-4 grid grid-cols-4 gap-2">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            class="rounded-xl px-2 py-2 text-sm transition"
            :class="
              activeTab === tab
                ? 'bg-white/10 text-[#E6E8EB]'
                : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#E6E8EB]'
            "
          >
            {{ tab }}
          </button>
        </div>
      </div>
    </header>

    <main
  class="flex-1 min-h-0 px-2 pb-2 pt-2 sm:px-4 sm:pb-4 sm:pt-3"
  :class="isScrollableTab ? 'overflow-y-auto' : 'overflow-hidden'"
>
  <div
    class="rounded-[24px] border border-white/10 bg-white/[0.03] p-2 sm:rounded-[28px] sm:p-4"
    :class="isScrollableTab ? '' : 'h-full'"
  >
    <template v-if="activeTab === 'Trend'">
      <FinanceLineChart class="h-full" />
    </template>

    <template v-else-if="activeTab === 'Weekly'">
      <FinanceWeeklyStackedBarChart
        class="h-full"
        @select-week="handleWeekSelect"
      />
    </template>

    <template v-else-if="activeTab === 'Categories'">
      <FinanceCategoryChart />
    </template>

    <template v-else-if="activeTab === 'Comparison'">
      <div class="space-y-6">
        <FinanceWeekComparisonChart />
        <FinanceMonthComparisonChart />
      </div>
    </template>
  </div>
</main>

    <transition name="sheet">
      <div
        v-if="selectedWeekIndex !== null"
        class="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm"
        @click.self="selectedWeekIndex = null"
      >
        <div
          class="w-full max-h-[85vh] rounded-t-3xl bg-[#0B0C10] p-4 pb-6 overflow-hidden"
        >
          <div class="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />

          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-[#E6E8EB]">
              Week {{ selectedWeekIndex + 1 }}
            </h3>

            <button
              @click="selectedWeekIndex = null"
              class="text-sm text-[#9CA3AF] transition hover:text-[#E6E8EB]"
            >
              Close
            </button>
          </div>

          <FinanceWeekDetailChart :weekIndex="selectedWeekIndex" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useFinanceStore } from '../stores/useFinanceStore'
import FinanceLineChart from '../components/FinanceLineChart.vue'
import FinanceWeeklyStackedBarChart from '../components/FinanceWeeklyStackedBarChart.vue'
import FinanceWeekDetailChart from '../components/FinanceWeekDetailChart.vue'
import FinanceCategoryChart from '../components/FinanceCategoryChart.vue'
import FinanceWeekComparisonChart from '../components/FinanceWeekComparisonChart.vue'
import FinanceMonthComparisonChart from '../components/FinanceMonthComparisonChart.vue'
import IconBack from '../components/icons/IconBack.vue'
import IconNext from '../components/icons/IconNext.vue'
import IconPrevious from '../components/icons/IconPrevious.vue'

const isScrollableTab = computed(() =>
  activeTab.value === 'Categories' || activeTab.value === 'Comparison'
)

const financeStore = useFinanceStore()

const tabs = ['Trend', 'Weekly', 'Categories', 'Comparison']
const activeTab = ref('Trend')
const selectedWeekIndex = ref(null)

function handleWeekSelect(index) {
  selectedWeekIndex.value =
    selectedWeekIndex.value === index ? null : index
}

function handlePrevMonth() {
  selectedWeekIndex.value = null
  financeStore.goToPreviousMonth()
}

function handleNextMonth() {
  if (financeStore.isCurrentMonth) return
  selectedWeekIndex.value = null
  financeStore.goToNextMonth()
}

watch(activeTab, () => {
  selectedWeekIndex.value = null
})
</script>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
  transition: all 0.25s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from > div,
.sheet-leave-to > div {
  transform: translateY(100%);
}

.sheet-enter-to > div,
.sheet-leave-from > div {
  transform: translateY(0);
}
</style>