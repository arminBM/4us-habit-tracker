import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from '../pages/DashboardPage.vue'
import AddEntryPage from '../pages/AddEntryPage.vue'
import FinancePage from '../pages/FinancePage.vue'
import WorkoutPage from '../pages/WorkoutPage.vue'
import StudyPage from '../pages/StudyPage.vue'
import SleepPage from '../pages/SleepPage.vue'
import SleepInsightsPage from '../pages/SleepInsightsPage.vue'
import SettingsPage from '../pages/SettingsPage.vue'
import FinanceInsightsPage from '../pages/FinanceInsightsPage.vue'

const routes = [
  { path: '/', name: 'dashboard', component: DashboardPage },
  { path: '/add', name: 'add-entry', component: AddEntryPage },
  { path: '/finance', name: 'finance', component: FinancePage },
  {
  path: '/finance/insights',
  name: 'finance-insights',
  component: FinanceInsightsPage,
  meta: { shell: false },
},
{
  path: '/finance/history',
  name: 'finance-history',
  component: () => import('../pages/FinanceHistoryPage.vue'),
},
{
  path: '/finance/budget-planner',
  name: 'finance-budget-planner',
  component: () => import('../pages/BudgetPlannerPage.vue'),
},
  { path: '/workout', name: 'workout', component: WorkoutPage },
  { path: '/study', name: 'study', component: StudyPage },
  { path: '/sleep', name: 'sleep', component: SleepPage },
  {
    path: '/sleep/insights',
    name: 'sleep-insights',
    component: SleepInsightsPage,
    meta: { shell: false },
  },
  {
  path: '/study/insights',
  name: 'study-insights',
  component: () => import('../pages/StudyInsightsPage.vue'),
  meta: { shell: false },
},
{
  path: '/workout/insights',
  name: 'workout-insights',
  component: () => import('../pages/WorkoutInsightsPage.vue'),
  meta: { shell: false },
},
{
  path: '/study/history',
  name: 'study-history',
  component: () => import('../pages/StudyHistoryPage.vue'),
},
{
  path: '/workout/history',
  name: 'workout-history',
  component: () => import('../pages/WorkoutHistoryPage.vue'),
},
  { path: '/settings', name: 'settings', component: SettingsPage },
  {
  path: '/sleep/history',
  name: 'sleep-history',
  component: () => import('../pages/SleepHistoryPage.vue'),
}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router