<template>
  <AppShell v-if="$route.meta.shell !== false">
    <router-view />
  </AppShell>

  <router-view v-else />
</template>

<script setup>
import { onMounted } from 'vue'
import AppShell from './components/AppShell.vue'
import { useEntriesStore } from './stores/useEntriesStore'
import { useFinanceStore } from './stores/useFinanceStore'

const entriesStore = useEntriesStore()
const financeStore = useFinanceStore()

onMounted(() => {
  entriesStore.loadEntries()
  financeStore.loadBudgets()
})
</script>