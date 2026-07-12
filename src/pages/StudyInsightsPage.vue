<template>
  <div class="fixed inset-0 flex flex-col bg-[#0B0C10] text-[#E6E8EB]">
    <header class="shrink-0 border-b border-white/10 bg-[#0B0C10]/90 backdrop-blur-xl">
      <div class="flex items-center justify-between px-4 py-4">
        <button
  @click="$router.back()"
  class="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-[#9CA3AF] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-[0.95]"
>
  <span class="h-5 w-5">
    <IconBack />
  </span>
</button>

        <h2 class="text-base font-semibold">Study Insights</h2>

        <div class="w-[70px]" />
      </div>

      <div class="px-4 pb-3">
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'rounded-xl py-2 text-sm transition',
              activeTab === tab.key
                ? 'bg-white/10 text-white'
                : 'text-secondary hover:bg-white/5'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </header>

    <main
      class="flex-1 min-h-0 px-3 py-3"
      :class="isScrollableTab ? 'overflow-y-auto' : 'overflow-hidden'"
    >
      <div
        class="rounded-3xl border border-white/10 bg-white/[0.03] p-3"
        :class="isScrollableTab ? '' : 'h-full'"
      >
        <StudyDurationChart v-if="activeTab === 'duration'" class="h-full" />

        <StudyWeeklyStackedBarChart
          v-else-if="activeTab === 'weekly'"
          class="h-full"
          @select-week="selectedWeek = $event"
        />

        <StudyCategoryChart v-else-if="activeTab === 'category'" />

        <StudyMonthComparisonChart v-else-if="activeTab === 'comparison'" />
      </div>
    </main>

    <transition name="sheet">
      <div
        v-if="selectedWeek !== null"
        class="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm"
        @click.self="selectedWeek = null"
      >
        <div
          class="w-full max-h-[80%] overflow-y-auto rounded-t-3xl bg-[#0B0C10] p-4 pb-6"
        >
          <div class="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />

          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              Week {{ selectedWeek + 1 }}
            </h3>

            <button
              @click="selectedWeek = null"
              class="text-sm text-[#9CA3AF]"
            >
              Close
            </button>
          </div>

          <StudyWeekDetailChart :weekIndex="selectedWeek" />
        </div>
      </div>
    </transition>

    <div class="px-3 pb-3">
      <div class="grid grid-cols-4 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
        <button
          v-for="tab in tabs"
          :key="tab.key + '-bottom'"
          @click="activeTab = tab.key"
          :class="[
            'rounded-xl py-2 text-xs transition',
            activeTab === tab.key
              ? 'bg-white/10 text-white'
              : 'text-secondary hover:bg-white/5'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

import StudyDurationChart from '../components/StudyDurationChart.vue'
import StudyWeeklyStackedBarChart from '../components/StudyWeeklyStackedBarChart.vue'
import StudyCategoryChart from '../components/StudyCategoryChart.vue'
import StudyWeekDetailChart from '../components/StudyWeekDetailChart.vue'
import StudyMonthComparisonChart from '../components/StudyMonthComparisonChart.vue'
import IconBack from '../components/icons/IconBack.vue'
import IconNext from '../components/icons/IconNext.vue'
import IconPrevious from '../components/icons/IconPrevious.vue'

const tabs = [
  { key: 'duration', label: 'Duration' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'category', label: 'Category' },
  { key: 'comparison', label: 'Compare' },
]

const activeTab = ref('duration')
const selectedWeek = ref(null)

const isScrollableTab = computed(() =>
  activeTab.value === 'category' || activeTab.value === 'comparison'
)

watch(activeTab, () => {
  selectedWeek.value = null
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