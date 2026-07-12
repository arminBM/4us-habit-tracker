<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <section>
  <h2 class="text-3xl font-semibold tracking-tight text-white">Add Entry</h2>
  <p class="mt-2 text-sm text-[#9CA3AF]">
    Add finance, workout, study, or sleep data.
  </p>
</section>

    <section class="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl shadow-slate-200/50">
      <div class="grid gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Type</label>
          <select
            v-model="type"
           class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
          >
            <option value="Finance">Finance</option>
            <option value="Workout">Workout</option>
            <option value="Study">Study</option>
            <option value="Sleep">Sleep</option>
          </select>
        </div>

        <template v-if="type === 'Finance'">
          
          <div>
            <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Entry Kind</label>
            <select
              v-model="entryKind"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Category</label>
            <select
  v-model="selectedCategory"
  class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
>
  <option
    v-for="categoryOption in financeCategories"
    :key="categoryOption"
    :value="categoryOption"
  >
    {{ categoryOption }}
  </option>
  <option value="Custom">Custom</option>
</select>
          </div>

          <div v-if="selectedCategory === 'Custom'">
            <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Custom Category</label>
            <input
              v-model="customCategory"
              type="text"
              placeholder="e.g. Gifts"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Amount</label>
            <input
              v-model.number="value"
              type="number"
              min="0"
              placeholder="e.g. 8"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Note</label>
            <input
              v-model="note"
              type="text"
              placeholder="Optional note"
              class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
            />
          </div>
        </template>

<template v-else-if="type === 'Workout'">
  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Category</label>
    <select
      v-model="workoutCategory"
      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
    >
      <option
        v-for="categoryOption in workoutCategories"
        :key="categoryOption"
        :value="categoryOption"
      >
        {{ categoryOption }}
      </option>
    </select>
  </div>

  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Duration (minutes)</label>
    <input
      v-model.number="workoutDurationMinutes"
      type="number"
      min="1"
      placeholder="e.g. 45"
      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
    />
  </div>

  <div class="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
    <p class="text-sm text-white">Duration Preview</p>
    <p class="mt-1 text-lg font-semibold text-[#9CA3AF]">
      {{ workoutDurationLabel }}
    </p>
  </div>

  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Intensity</label>
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="level in [1, 2, 3, 4, 5]"
        :key="level"
        type="button"
        @click="workoutIntensity = level"
        class="rounded-2xl border px-3 py-3 text-sm font-medium transition"
        :class="
          workoutIntensity === level
            ? 'bg-white text-black'
            : 'bg-white/5 text-[#9CA3AF] border-white/10 hover:bg-white/10'
        "
      >
        {{ level }}
      </button>
    </div>
    <p class="mt-2 text-xs text-slate-500">
      1 = very light, 5 = very hard
    </p>
  </div>

  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Note</label>
    <input
      v-model="workoutNote"
      type="text"
      placeholder="Optional"
      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
    />
  </div>

  <p v-if="workoutError" class="text-sm font-medium text-red-600">
    {{ workoutError }}
  </p>
</template>

        <template v-else-if="type === 'Sleep'">
  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Sleep Start</label>
    <input
      v-model="sleepStart"
      type="datetime-local"
      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
    />
  </div>

  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Sleep End</label>
    <input
      v-model="sleepEnd"
      type="datetime-local"
     class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
    />
  </div>

  <div class="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
    <p class="text-sm text-white">Duration Preview</p>
    <p class="mt-1 text-lg font-semibold text-[#9CA3AF]">
      {{ sleepDurationMinutes > 0 ? sleepDurationLabel : 'Invalid sleep range' }}
    </p>
  </div>
  <div class="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
  <p class="text-sm text-white">Sleep Summary</p>

  <div class="mt-2 space-y-1 text-sm text-[#9CA3AF]">
    <p>
      Counted for:
      <span class="font-medium text-[#9CA3AF]">
        {{ sleepDurationMinutes > 0 ? sleepAnchorDateLabel : '—' }}
      </span>
    </p>

    <p>
      Category:
      <span class="font-medium text-[#9CA3AF]">Main Sleep</span>
    </p>
  </div>
</div>

  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Sleep Quality</label>
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="quality in [1, 2, 3, 4, 5]"
        :key="quality"
        type="button"
        @click="sleepQuality = quality"
        class="rounded-2xl border px-3 py-3 text-sm font-medium transition"
        :class="
          sleepQuality === quality
            ? 'bg-white text-black'
            : 'bg-white/5 text-[#9CA3AF] border-white/10 hover:bg-white/10'
        "
      >
        {{ quality }}
      </button>
    </div>
    <p class="mt-2 text-xs text-slate-500">
      1 = very bad, 5 = very good
    </p>
  </div>

  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Note</label>
    <input
      v-model="sleepNote"
      type="text"
      placeholder="Optional"
      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
    />
  </div>

  <p v-if="sleepError" class="text-sm font-medium text-red-600">
    {{ sleepError }}
  </p>
</template>

       <template v-else-if="type === 'Study'">

  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Category</label>
    <select
      v-model="studyCategory"
      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
    >
      <option
        v-for="categoryOption in studyCategories"
        :key="categoryOption"
        :value="categoryOption"
      >
        {{ categoryOption }}
      </option>
    </select>
  </div>

  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Subject / Topic</label>
    <input
      v-model="studySubject"
      type="text"
      placeholder="Optional, e.g. IELTS Reading, Vue Router, Biology Chapter 2"
      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
    />
  </div>


  <div>
  <p class="mb-2 text-xs text-[#7C8591]">Quick Add Time</p>

  <div class="flex gap-2 overflow-x-auto no-scrollbar">
    <button
      v-for="minutes in quickStudyDurations"
      :key="minutes"
      type="button"
      @click="addStudyDuration(minutes)"
      class="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#9CA3AF] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-[0.95]"
    >
      +{{ minutes }}m
    </button>

    
  </div>
</div>

  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Duration (minutes)</label>
    <input
      v-model.number="studyDurationMinutes"
      type="number"
      min="1"
      placeholder="e.g. 90"
      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
    />
  </div>
  <button
      type="button"
      @click="studyDurationMinutes = 0"
      class="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-red-300 transition-all duration-200 hover:bg-red-500/10 hover:text-red-200 active:scale-[0.95]"
    >
      Clear
    </button>

  <div class="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
    <p class="text-sm text-white">Duration Preview</p>
    <p class="mt-1 text-lg font-semibold text-[#9CA3AF]">
      {{ studyDurationLabel }}
    </p>
  </div>

  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Focus Level</label>
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="level in [1, 2, 3, 4, 5]"
        :key="level"
        type="button"
        @click="studyFocusLevel = level"
        class="rounded-2xl border px-3 py-3 text-sm font-medium transition"
        :class="
          studyFocusLevel === level
            ? 'bg-white text-black'
            : 'bg-white/5 text-[#9CA3AF] border-white/10 hover:bg-white/10'
        "
      >
        {{ level }}
      </button>
    </div>
    <p class="mt-2 text-xs text-slate-500">
      1 = very distracted, 5 = deep focus
    </p>
  </div>

  <div>
    <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Note</label>
    <input
      v-model="studyNote"
      type="text"
      placeholder="Optional"
      class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
    />
  </div>

  <p v-if="studyError" class="text-sm font-medium text-red-600">
    {{ studyError }}
  </p>
</template>
<template v-else>
  <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
    Unsupported entry type
  </div>
</template>

        <div>
          <label class="mb-2 block text-sm font-medium text-[#9CA3AF]">Date</label>
          <input
            v-model="date"
            type="date"
            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-[#6B7280] outline-none transition focus:border-white/20 focus:bg-white/10"
          />
        </div>

        <button
  @click="saveEntry"
  class="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition duration-200 hover:bg-white/90 active:scale-[0.98]"
>
  <IconAdd class="h-4 w-4" />
  Save Entry
</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useEntriesStore } from '../stores/useEntriesStore'

const quickStudyDurations = [30, 45, 60, 90]

function addStudyDuration(minutes) {
  const current = Number(studyDurationMinutes.value) || 0
  studyDurationMinutes.value = current + minutes
}



const studyCategories = [
  'Reading',
  'Writing',
  'Listening',
  'Speaking',
  'Language Learning',
  'Coding',
  'Research',
  'Exam Prep',
  'Coursework',
  'Other',
]

const studyCategory = ref('Reading')
const studySubject = ref('')
const studyDurationMinutes = ref(null)
const studyFocusLevel = ref(3)
const studyNote = ref('')
const studyError = ref('')

const studyDurationLabel = computed(() => {
  const minutes = Number(studyDurationMinutes.value) || 0
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  if (minutes <= 0) return 'Enter a valid duration'
  return `${h}h ${m}m`
})

const workoutDurationLabel = computed(() => {
  const minutes = Number(workoutDurationMinutes.value) || 0
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  if (minutes <= 0) return 'Enter a valid duration'
  return `${h}h ${m}m`
})

const workoutCategories = [
  'Strength',
  'Cardio',
  'Walking',
  'Running',
  'Cycling',
  'Mobility',
  'Stretching',
  'Sports',
  'Home Workout',
  'Other',
]

const workoutCategory = ref('Strength')
const workoutDurationMinutes = ref(null)
const workoutIntensity = ref(3)
const workoutNote = ref('')
const workoutError = ref('')

const sleepStart = ref(getDefaultSleepStart())
const sleepEnd = ref(getDefaultSleepEnd())
const sleepQuality = ref(3)
const sleepNote = ref('')
const sleepError = ref('')

function toDateTimeLocalValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function getDefaultSleepStart() {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  date.setHours(23, 0, 0, 0)
  return toDateTimeLocalValue(date)
}

function getDefaultSleepEnd() {
  const date = new Date()
  date.setHours(7, 0, 0, 0)
  return toDateTimeLocalValue(date)
}

const sleepDurationMinutes = computed(() => {
  if (!sleepStart.value || !sleepEnd.value) return 0

  const start = new Date(sleepStart.value)
  const end = new Date(sleepEnd.value)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0
  if (end <= start) return 0

  return Math.round((end - start) / 60000)
})

const sleepDurationLabel = computed(() => {
  const minutes = sleepDurationMinutes.value
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
})

function formatSleepAnchorDate(dateString) {
  if (!dateString) return '—'

  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

const sleepAnchorDate = computed(() => {
  if (!sleepEnd.value || !sleepEnd.value.includes('T')) return ''
  return sleepEnd.value.split('T')[0]
})

const sleepAnchorDateLabel = computed(() => {
  return sleepAnchorDate.value
    ? formatSleepAnchorDate(sleepAnchorDate.value)
    : '—'
})

const entriesStore = useEntriesStore()

const expenseCategories = [
  'Coffee Shop',
  'Groceries',
  'Transport',
  'Eating Out',
  'Shopping',
  'Bills',
  'Health',
  'Entertainment',
  'Education',
  'Other',
]

const incomeCategories = [
  'Salary',
  'Wage',
  'Freelance',
  'Gift',
  'Refund',
  'Bonus',
  'Investment',
  'Selling',
  'Other',
]

const type = ref('Finance')
const entryKind = ref('expense')
const selectedCategory = ref('Coffee Shop')
const customCategory = ref('')
const category = ref('')
const value = ref(null)
const date = ref(new Date().toISOString().split('T')[0])
const note = ref('')

const financeCategories = computed(() => {
  return entryKind.value === 'income' ? incomeCategories : expenseCategories
})

watch(type, (newType) => {
  if (newType === 'Finance') {
    entryKind.value = 'expense'
    selectedCategory.value = expenseCategories[0]
    customCategory.value = ''
    note.value = ''
  } else if (newType === 'Sleep') {
    sleepStart.value = getDefaultSleepStart()
    sleepEnd.value = getDefaultSleepEnd()
    sleepQuality.value = 3
    sleepNote.value = ''
    sleepError.value = ''
  } else if (newType === 'Workout') {
    workoutCategory.value = workoutCategories[0]
    workoutDurationMinutes.value = null
    workoutIntensity.value = 3
    workoutNote.value = ''
    workoutError.value = ''
  } else if (newType === 'Study') {
    studyCategory.value = studyCategories[0]
    studySubject.value = ''
    studyDurationMinutes.value = null
    studyFocusLevel.value = 3
    studyNote.value = ''
    studyError.value = ''
  }

  value.value = null
})

watch(entryKind, (newKind) => {
  if (type.value === 'Finance') {
    selectedCategory.value =
      newKind === 'income' ? incomeCategories[0] : expenseCategories[0]
    customCategory.value = ''
  }
})

function getFinalCategory() {
  if (type.value !== 'Finance') {
    return category.value.trim()
  }

  if (selectedCategory.value === 'Custom') {
    return customCategory.value.trim()
  }

  return selectedCategory.value
}

async function saveEntry() {
  // 🟢 SLEEP HANDLING
  if (type.value === 'Sleep') {
  sleepError.value = ''

  if (!sleepStart.value || !sleepEnd.value) {
    sleepError.value = 'Please enter both sleep start and sleep end.'
    return
  }

  const start = new Date(sleepStart.value)
  const end = new Date(sleepEnd.value)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    sleepError.value = 'Please enter a valid sleep range.'
    return
  }

  if (end <= start) {
    sleepError.value = 'Sleep end must be later than sleep start.'
    return
  }

  const durationMinutes = Math.round((end - start) / 60000)

  const payload = {
    type: 'Sleep',
    category: 'Main Sleep',
    sleepStart: sleepStart.value,
    sleepEnd: sleepEnd.value,
    durationMinutes,
    sleepQuality: Number(sleepQuality.value),
    note: sleepNote.value.trim(),
    date: sleepEnd.value.split('T')[0],
  }

  await entriesStore.addEntry(payload)

  sleepStart.value = getDefaultSleepStart()
  sleepEnd.value = getDefaultSleepEnd()
  sleepQuality.value = 3
  sleepNote.value = ''
  sleepError.value = ''
  date.value = new Date().toISOString().split('T')[0]

  return
}

if (type.value === 'Study') {
  studyError.value = ''

  if (!studyCategory.value.trim()) {
    studyError.value = 'Please choose a study category.'
    return
  }

  if (!studyDurationMinutes.value || Number(studyDurationMinutes.value) <= 0) {
    studyError.value = 'Please enter a valid study duration.'
    return
  }

  const payload = {
    type: 'Study',
    category: studyCategory.value,
    subject: studySubject.value.trim(),
    durationMinutes: Number(studyDurationMinutes.value),
    focusLevel: Number(studyFocusLevel.value),
    note: studyNote.value.trim(),
    date: date.value,
  }

  await entriesStore.addEntry(payload)

  studyCategory.value = studyCategories[0]
  studySubject.value = ''
  studyDurationMinutes.value = null
  studyFocusLevel.value = 3
  studyNote.value = ''
  studyError.value = ''
  date.value = new Date().toISOString().split('T')[0]

  return
}

 // 🟢 WORKOUT (MOVE HERE)
  if (type.value === 'Workout') {
    workoutError.value = ''

    if (!workoutCategory.value.trim()) {
      workoutError.value = 'Please choose a workout category.'
      return
    }

    if (!workoutDurationMinutes.value || Number(workoutDurationMinutes.value) <= 0) {
      workoutError.value = 'Please enter a valid workout duration.'
      return
    }

    const payload = {
      type: 'Workout',
      category: workoutCategory.value,
      durationMinutes: Number(workoutDurationMinutes.value),
      intensity: Number(workoutIntensity.value),
      note: workoutNote.value.trim(),
      date: date.value,
    }

    await entriesStore.addEntry(payload)

    workoutCategory.value = workoutCategories[0]
    workoutDurationMinutes.value = null
    workoutIntensity.value = 3
    workoutNote.value = ''
    workoutError.value = ''
    date.value = new Date().toISOString().split('T')[0]

    return
  }



  // 🟢 EXISTING LOGIC (UNCHANGED)
  const finalCategory = getFinalCategory()

  if (!finalCategory || value.value === null || value.value === '') return

  const payload = {
    type: type.value,
    category: finalCategory,
    value: Number(value.value),
    date: date.value,
  }

  if (type.value === 'Finance') {
    payload.entryKind = entryKind.value
    payload.note = note.value.trim()
  }

  await entriesStore.addEntry(payload)

  if (type.value === 'Finance') {
    entryKind.value = 'expense'
    selectedCategory.value = expenseCategories[0]
    customCategory.value = ''
    note.value = ''
  } else {
    category.value = ''
  }
  

  value.value = null
  date.value = new Date().toISOString().split('T')[0]
}
  
</script>