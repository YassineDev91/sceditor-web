<template>
    <TransitionRoot appear :show="open" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-50">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/30" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3"
                                class="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                                Settings
                            </DialogTitle>

                            <TabGroup>
                                <TabList class="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-700 p-1">
                                    <Tab v-slot="{ selected }" as="template">
                                        <button :class="[
                                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                            selected
                                                ? 'bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-400 shadow'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white',
                                        ]">
                                            LLM Configuration
                                        </button>
                                    </Tab>
                                    <Tab v-slot="{ selected }" as="template">
                                        <button :class="[
                                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                            selected
                                                ? 'bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-400 shadow'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white',
                                        ]">
                                            Editor Preferences
                                        </button>
                                    </Tab>
                                    <Tab v-slot="{ selected }" as="template">
                                        <button :class="[
                                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                            selected
                                                ? 'bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-400 shadow'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900 dark:hover:text-white',
                                        ]">
                                            About
                                        </button>
                                    </Tab>
                                </TabList>

                                <TabPanels class="mt-4">
                                    <!-- LLM Configuration Tab -->
                                    <TabPanel class="rounded-xl bg-white dark:bg-gray-800 p-3">
                                        <LLMConfigTab />
                                    </TabPanel>

                                    <!-- Editor Preferences Tab -->
                                    <TabPanel class="rounded-xl bg-white dark:bg-gray-800 p-3">
                                        <EditorPreferencesTab />
                                    </TabPanel>

                                    <!-- About Tab -->
                                    <TabPanel class="rounded-xl bg-white dark:bg-gray-800 p-3">
                                        <AboutTab />
                                    </TabPanel>
                                </TabPanels>
                            </TabGroup>

                            <div class="mt-6 flex justify-between">
                                <button type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-red-100 dark:bg-red-900 px-4 py-2 text-sm font-medium text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                                    @click="resetSettings">
                                    Reset to Defaults
                                </button>
                                <button type="button"
                                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-blue-900 px-4 py-2 text-sm font-medium text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                    @click="closeModal">
                                    Close
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { useSettingsStore } from '@/stores/settings'
import LLMConfigTab from './settings/LLMConfigTab.vue'
import EditorPreferencesTab from './settings/EditorPreferencesTab.vue'
import AboutTab from './settings/AboutTab.vue'

const props = defineProps({
    open: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:open'])

const settingsStore = useSettingsStore()

const closeModal = () => {
    emit('update:open', false)
}

const resetSettings = () => {
    settingsStore.resetToDefaults()
}
</script>
