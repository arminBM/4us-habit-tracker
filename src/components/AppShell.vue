<template>
  <div class="min-h-screen bg-[#0B0C10] text-[#E6E8EB]">
    <header class="sticky top-0 z-30 border-b border-white/10 bg-[#0B0C10]/80 backdrop-blur-2xl">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <h1 class="text-xl font-semibold tracking-tight text-[#F3F4F6]">4US</h1>
          <p class="mt-1 text-sm text-[#9CA3AF]">Offline first</p>
        </div>

        <div class="flex items-center gap-2">
          <router-link
            to="/settings"
            class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[#E6E8EB] transition duration-200 hover:bg-white/10 active:scale-[0.98]"
          >
            <span class="h-5 w-5 shrink-0">
              <IconSettings />
            </span>
          </router-link>

          <router-link
            to="/add"
            class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-[#F3F4F6] transition duration-200 hover:bg-white/15 active:scale-[0.98]"
          >
            <span class="h-5 w-5 shrink-0">
              <IconAdd />
            </span>
          </router-link>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-5 pb-32 sm:px-6 sm:py-6">
      <slot />
    </main>

    <nav class="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#0F1116]/85 backdrop-blur-2xl">
      <div class="mx-auto max-w-6xl px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <div class="grid grid-cols-5 gap-2 rounded-[28px] border border-white/10 bg-white/[0.03] p-2 shadow-[0_-8px_30px_rgba(0,0,0,0.25)]">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            custom
            v-slot="{ isActive, navigate }"
          >
            <button
              @click="navigate"
              class="group flex min-h-[64px] flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition-all duration-300 active:scale-[0.97]"
              :class="
                isActive
                  ? 'bg-white/10 text-[#E6E8EB] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                  : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#E6E8EB]'
              "
            >
              <component
                :is="item.icon"
                class="mb-1 transition-all duration-300"
                :class="isActive ? 'scale-110' : 'scale-100'"
              />

              <span
                class="text-[11px] font-medium sm:text-xs"
                :class="isActive ? 'text-[#F3F4F6]' : ''"
              >
                {{ item.label }}
              </span>
            </button>
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import IconHome from '../components/icons/IconHome.vue'
import IconFinance from '../components/icons/IconFinance.vue'
import IconWorkout from '../components/icons/IconWorkout.vue'
import IconStudy from '../components/icons/IconStudy.vue'
import IconSleep from '../components/icons/IconSleep.vue'
import IconAdd from './icons/IconAdd.vue'
import IconSettings from './icons/IconSettings.vue'

const navItems = [
  { to: '/', label: 'Home', icon: IconHome },
  { to: '/study', label: 'Study', icon: IconStudy },
  { to: '/finance', label: 'Finance', icon: IconFinance },
  { to: '/workout', label: 'Workout', icon: IconWorkout },
  { to: '/sleep', label: 'Sleep', icon: IconSleep },
]
</script>