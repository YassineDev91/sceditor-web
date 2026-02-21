<template>
    <div class="space-y-4 text-sm dark:text-gray-200">
        <h4 class="font-semibold text-gray-900 dark:text-white mb-3">Editor Preferences</h4>

        <!-- Autosave Settings -->
        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
            <h5 class="font-medium text-gray-900 dark:text-white">Autosave</h5>

            <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Autosave
                </label>
                <button @click="toggleAutosave" :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    settingsStore.editor.autosaveEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                ]">
                    <span :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        settingsStore.editor.autosaveEnabled ? 'translate-x-6' : 'translate-x-1'
                    ]" />
                </button>
            </div>

            <div v-if="settingsStore.editor.autosaveEnabled">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Autosave Interval (seconds)
                </label>
                <input type="number" v-model.number="autosaveSeconds" @blur="updateAutosaveInterval" min="5" max="300"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Changes are saved every {{ autosaveSeconds }} seconds
                </p>
            </div>
        </div>

        <!-- Canvas Settings -->
        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
            <h5 class="font-medium text-gray-900 dark:text-white">Canvas</h5>

            <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Grid
                </label>
                <button @click="toggleGrid" :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    settingsStore.editor.gridEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                ]">
                    <span :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        settingsStore.editor.gridEnabled ? 'translate-x-6' : 'translate-x-1'
                    ]" />
                </button>
            </div>

            <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Snap to Grid
                </label>
                <button @click="toggleSnapToGrid" :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    settingsStore.editor.snapToGrid ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                ]">
                    <span :class="[
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                        settingsStore.editor.snapToGrid ? 'translate-x-6' : 'translate-x-1'
                    ]" />
                </button>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Grid Size (pixels)
                </label>
                <input type="number" v-model.number="settingsStore.editor.gridSize" @blur="saveSettings" min="10"
                    max="100" step="5"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
            </div>
        </div>

        <!-- Theme Settings -->
        <div class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
            <h5 class="font-medium text-gray-900 dark:text-white">Appearance</h5>

            <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Theme
                </label>
                <select v-model="settingsStore.editor.theme" @change="saveSettings"
                    class="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

const autosaveSeconds = computed({
    get: () => settingsStore.editor.autosaveInterval / 1000,
    set: (value) => {
        settingsStore.editor.autosaveInterval = value * 1000
    }
})

const saveSettings = () => {
    settingsStore.saveSettings()
}

const toggleAutosave = () => {
    settingsStore.editor.autosaveEnabled = !settingsStore.editor.autosaveEnabled
    saveSettings()
}

const toggleGrid = () => {
    settingsStore.editor.gridEnabled = !settingsStore.editor.gridEnabled
    saveSettings()
}

const toggleSnapToGrid = () => {
    settingsStore.editor.snapToGrid = !settingsStore.editor.snapToGrid
    saveSettings()
}

const updateAutosaveInterval = () => {
    if (autosaveSeconds.value < 5) autosaveSeconds.value = 5
    if (autosaveSeconds.value > 300) autosaveSeconds.value = 300
    saveSettings()
}
</script>
