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

        <h2 class="text-base font-semibold">Sleep Insights</h2>

        <button
          @click="handleExport"
          :disabled="isExporting || activeTab === 'schedule'"
          class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#9CA3AF] transition hover:bg-white/10 hover:text-[#E6E8EB] disabled:opacity-50"
        >
          {{ isExporting ? 'Saving...' : 'Export' }}
        </button>
      </div>

      <div class="px-3 pb-3 sm:px-4">
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'rounded-xl px-2 py-2 text-sm transition',
              activeTab === tab.key
                ? 'bg-white/10 text-[#E6E8EB]'
                : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#E6E8EB]'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-hidden px-2 pb-2 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
  <div
    ref="visibleChartRef"
    class="h-full rounded-[24px] border border-white/10 bg-white/[0.03] p-2 sm:rounded-[28px] sm:p-4"
  >
        <SleepDurationChart v-if="activeTab === 'duration'" class="h-full" />
<SleepWeeklyChart
  v-else-if="activeTab === 'weekly'"
  class="h-full"
  @select-week="selectedWeek = $event"
/>        <SleepScheduleChart v-else-if="activeTab === 'schedule'" class="h-full" />
        <SleepQualityChart v-else-if="activeTab === 'quality'" class="h-full" />
      </div>
    </main>

    <!-- Hidden export charts: keep all mounted -->
    <div class="fixed inset-0 pointer-events-none opacity-0 -z-10 overflow-hidden">
      <div class="absolute left-0 top-0 w-[1600px] p-6 bg-[#0B0C10]">
        <div ref="durationExportRef" v-show="activeTab === 'duration'">
          <SleepDurationChart exportMode />
        </div>

        <div ref="weeklyExportRef" v-show="activeTab === 'weekly'">
          <SleepWeeklyChart exportMode />
        </div>

        <div ref="scheduleExportRef" v-show="activeTab === 'schedule'">
          <SleepScheduleChart exportMode />
        </div>

        <div ref="qualityExportRef" v-show="activeTab === 'quality'">
          <SleepQualityChart exportMode />
        </div>
      </div>
    </div>

    <transition name="sheet">
  <div
    v-if="selectedWeek !== null"
    class="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm"
    @click.self="selectedWeek = null"
  >
    <div
      class="w-full max-h-[80%] overflow-y-auto rounded-t-3xl bg-[#0B0C10] p-4 pb-6"
    >
      <!-- Handle -->
      <div class="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />

      <!-- Header -->
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

      <!-- Your detailed component -->
      <SleepWeekDetailChart
        :weekIndex="selectedWeek"
      />
    </div>
  </div>
</transition>

    <div class="shrink-0 px-3 pb-3">
      <div class="grid grid-cols-4 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
        <button
          v-for="tab in tabs"
          :key="`${tab.key}-bottom`"
          @click="activeTab = tab.key"
          :class="[
            'rounded-xl px-2 py-2 text-xs transition',
            activeTab === tab.key
              ? 'bg-white/10 text-[#E6E8EB]'
              : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#E6E8EB]'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { toPng } from 'html-to-image'

import SleepDurationChart from '../components/SleepDurationChart.vue'
import SleepWeeklyChart from '../components/SleepWeeklyChart.vue'
import SleepScheduleChart from '../components/SleepScheduleChart.vue'
import SleepQualityChart from '../components/SleepQualityChart.vue'
import SleepWeekDetailChart from '../components/SleepWeekDetailChart.vue'
import IconBack from '../components/icons/IconBack.vue'

const visibleChartRef = ref(null)

const selectedWeek = ref(null)

const tabs = [
  { key: 'duration', label: 'Duration' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'quality', label: 'Quality' },
]

const activeTab = ref('duration')
const isExporting = ref(false)

const durationExportRef = ref(null)
const weeklyExportRef = ref(null)
const scheduleExportRef = ref(null)
const qualityExportRef = ref(null)

function getExportFileName() {
  const active = tabs.find(tab => tab.key === activeTab.value)
  const label = active ? active.label.toLowerCase() : 'chart'
  return `sleep-insights-${label}.png`
}

function getActiveExportRef() {
  if (activeTab.value === 'schedule') return visibleChartRef.value
  if (activeTab.value === 'duration') return durationExportRef.value
  if (activeTab.value === 'weekly') return weeklyExportRef.value
  if (activeTab.value === 'quality') return qualityExportRef.value
  return null
}

async function handleExport() {
    
  if (isExporting.value) return

  try {
    isExporting.value = true

    await nextTick()

    if (document.fonts?.ready) {
      await document.fonts.ready
    }

    const exportNode = getActiveExportRef()
    if (!exportNode) {
      throw new Error('No export target found for active chart')
    }

    await new Promise(resolve =>
      setTimeout(resolve, activeTab.value === 'schedule' ? 1200 : 700)
    )

    const dataUrl = await toPng(exportNode, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#0B0C10',
    })

    const link = document.createElement('a')
    link.download = getExportFileName()
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Failed to export chart image:', error)
    alert('Could not export this chart image.')
  } finally {
    isExporting.value = false
  }
}
</script>